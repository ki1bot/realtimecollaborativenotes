import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/app/lib/auth";
import { connectDatabase } from "@/app/lib/db";
import { generateToken } from "@/app/lib/jwt";
import { canEditNote, canViewNote, isOwner } from "@/app/lib/permissions";
import ActivityLog from "@/app/models/ActivityLog";
import Note from "@/app/models/Note";
import User from "@/app/models/User";

export const dynamic = "force-dynamic";

const formatUser = (user: any) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  avatar: user.avatar || "",
});

const populateNote = (query: any) => {
  return query
    .populate("owner", "_id name email avatar")
    .populate("collaborators.user", "_id name email avatar")
    .populate("lastEditedBy", "_id name email avatar");
};

const populateActivity = (query: any) => {
  return query.populate("user", "_id name email avatar");
};

const jsonError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

const normalizeError = (error: any) => {
  if (error?.status) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  if (error?.code === 11000) {
    return {
      message: "Email sudah digunakan",
      status: 409,
    };
  }

  if (error?.name === "CastError") {
    return {
      message: "ID tidak valid",
      status: 400,
    };
  }

  if (error?.name === "ValidationError") {
    return {
      message: Object.values(error.errors)
        .map((item: any) => item.message)
        .join(", "),
      status: 400,
    };
  }

  return {
    message: error?.message || "Terjadi kesalahan server",
    status: 500,
  };
};

const getId = (request: NextRequest) => {
  return request.nextUrl.searchParams.get("id") || "";
};

const getUserId = (request: NextRequest) => {
  return request.nextUrl.searchParams.get("userId") || "";
};

const getGoogleClient = () => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    const error = new Error(
      "GOOGLE_CLIENT_ID, NEXT_PUBLIC_GOOGLE_CLIENT_ID, dan GOOGLE_CLIENT_SECRET wajib diisi",
    ) as Error & { status?: number };

    error.status = 500;
    throw error;
  }

  return {
    googleClientId,
    client: new OAuth2Client(googleClientId, googleClientSecret, "postmessage"),
  };
};

const getGoogleProfile = async (code: string) => {
  const { googleClientId, client } = getGoogleClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) {
    const error = new Error("Token Google tidak valid") as Error & {
      status?: number;
    };

    error.status = 401;
    throw error;
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    const error = new Error("Email Google belum terverifikasi") as Error & {
      status?: number;
    };

    error.status = 401;
    throw error;
  }

  return {
    googleId: payload.sub,
    name: payload.name || payload.email.split("@")[0],
    email: payload.email.trim().toLowerCase(),
    avatar: payload.picture || "",
  };
};

const createActivity = async ({
  note,
  user,
  action,
  message,
}: {
  note: string;
  user: string;
  action:
    | "create"
    | "update_title"
    | "update_content"
    | "update_note"
    | "share"
    | "update_collaborator"
    | "remove_collaborator"
    | "delete";
  message: string;
}) => {
  await ActivityLog.create({
    note,
    user,
    action,
    message,
  });
};

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();

    const action = request.nextUrl.searchParams.get("action");

    if (action === "me") {
      const user = await getAuthUser(request);

      return NextResponse.json({
        user: formatUser(user),
      });
    }

    if (action === "notes") {
      const user = await getAuthUser(request);

      const notes = await populateNote(
        Note.find({
          $or: [{ owner: user._id }, { "collaborators.user": user._id }],
        }).sort({ updatedAt: -1 }),
      );

      return NextResponse.json(notes);
    }

    if (action === "note") {
      const user = await getAuthUser(request);
      const id = getId(request);

      if (!id) {
        return jsonError("ID note wajib diisi", 400);
      }

      const note = await populateNote(Note.findById(id));

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!canViewNote(note, user._id)) {
        return jsonError("Kamu tidak punya akses ke note ini", 403);
      }

      return NextResponse.json(note);
    }

    if (action === "activities") {
      const user = await getAuthUser(request);
      const id = getId(request);

      if (!id) {
        return jsonError("ID note wajib diisi", 400);
      }

      const note = await Note.findById(id);

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!canViewNote(note, user._id)) {
        return jsonError("Kamu tidak punya akses ke activity note ini", 403);
      }

      const activities = await populateActivity(
        ActivityLog.find({ note: id }).sort({ createdAt: -1 }).limit(30),
      );

      return NextResponse.json(activities);
    }

    if (action === "users") {
      const user = await getAuthUser(request);
      const keyword = request.nextUrl.searchParams.get("keyword")?.trim() || "";

      if (!keyword) {
        return NextResponse.json([]);
      }

      const users = await User.find({
        _id: { $ne: user._id },
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      })
        .select("_id name email avatar")
        .limit(10);

      return NextResponse.json(users);
    }

    return jsonError("Action tidak ditemukan", 404);
  } catch (error: any) {
    const result = normalizeError(error);
    return jsonError(result.message, result.status);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();

    const action = request.nextUrl.searchParams.get("action");
    const body = await request.json();

    if (action === "register") {
      const name = body.name?.trim();
      const email = body.email?.trim().toLowerCase();
      const password = body.password;

      if (!name || !email || !password) {
        return jsonError("Nama, email, dan password wajib diisi", 400);
      }

      if (password.length < 6) {
        return jsonError("Password minimal 6 karakter", 400);
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return jsonError("Email sudah digunakan", 409);
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      return NextResponse.json(
        {
          user: formatUser(user),
          token: generateToken(String(user._id)),
        },
        { status: 201 },
      );
    }

    if (action === "login") {
      const email = body.email?.trim().toLowerCase();
      const password = body.password;

      if (!email || !password) {
        return jsonError("Email dan password wajib diisi", 400);
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user || !(await user.comparePassword(password))) {
        return jsonError("Email atau password salah", 401);
      }

      return NextResponse.json({
        user: formatUser(user),
        token: generateToken(String(user._id)),
      });
    }

    if (action === "google-login") {
      const code = body.code?.trim();

      if (!code) {
        return jsonError("Kode login Google tidak ditemukan", 400);
      }

      const googleProfile = await getGoogleProfile(code);
      let user = await User.findOne({ email: googleProfile.email });

      if (!user) {
        user = await User.create({
          name: googleProfile.name,
          email: googleProfile.email,
          password: randomBytes(32).toString("hex"),
          avatar: googleProfile.avatar,
        });
      } else {
        let shouldSave = false;

        if (!user.avatar && googleProfile.avatar) {
          user.avatar = googleProfile.avatar;
          shouldSave = true;
        }

        if (shouldSave) {
          await user.save();
        }
      }

      return NextResponse.json({
        user: formatUser(user),
        token: generateToken(String(user._id)),
      });
    }

    if (action === "notes") {
      const user = await getAuthUser(request);
      const title = body.title?.trim() || "Untitled Note";
      const content = typeof body.content === "string" ? body.content : "";

      const note = await Note.create({
        title,
        content,
        owner: user._id,
        collaborators: [
          {
            user: user._id,
            role: "owner",
          },
        ],
        lastEditedBy: user._id,
      });

      await createActivity({
        note: String(note._id),
        user: String(user._id),
        action: "create",
        message: `${user.name} membuat note "${note.title}".`,
      });

      const populatedNote = await populateNote(Note.findById(note._id));

      return NextResponse.json(populatedNote, { status: 201 });
    }

    if (action === "collaborators") {
      const user = await getAuthUser(request);
      const id = getId(request);
      const selectedRole = ["editor", "viewer"].includes(body.role)
        ? body.role
        : "viewer";

      if (!id) {
        return jsonError("ID note wajib diisi", 400);
      }

      const note: any = await Note.findById(id);

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!isOwner(note, user._id)) {
        return jsonError(
          "Hanya owner yang boleh menambahkan collaborator",
          403,
        );
      }

      const targetUser = body.userId
        ? await User.findById(body.userId)
        : await User.findOne({ email: body.email?.toLowerCase() });

      if (!targetUser) {
        return jsonError("User tidak ditemukan", 404);
      }

      if (String(targetUser._id) === String(user._id)) {
        return jsonError("Owner sudah punya akses", 400);
      }

      const existingCollaborator = note.collaborators.find((item: any) => {
        return String(item.user) === String(targetUser._id);
      });

      if (existingCollaborator) {
        existingCollaborator.role = selectedRole;

        await createActivity({
          note: String(note._id),
          user: String(user._id),
          action: "update_collaborator",
          message: `${user.name} mengubah role ${targetUser.name} menjadi ${selectedRole}.`,
        });
      } else {
        note.collaborators.push({
          user: targetUser._id,
          role: selectedRole,
        });

        await createActivity({
          note: String(note._id),
          user: String(user._id),
          action: "share",
          message: `${user.name} membagikan note ke ${targetUser.name} sebagai ${selectedRole}.`,
        });
      }

      await note.save();

      const populatedNote = await populateNote(Note.findById(note._id));

      return NextResponse.json(populatedNote, { status: 201 });
    }

    return jsonError("Action tidak ditemukan", 404);
  } catch (error: any) {
    const result = normalizeError(error);
    return jsonError(result.message, result.status);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDatabase();

    const action = request.nextUrl.searchParams.get("action");
    const body = await request.json();

    if (action === "change-password") {
      const authUser = await getAuthUser(request);
      const currentPassword = body.currentPassword;
      const newPassword = body.newPassword;

      if (!currentPassword || !newPassword) {
        return jsonError("Password lama dan password baru wajib diisi", 400);
      }

      if (newPassword.length < 6) {
        return jsonError("Password baru minimal 6 karakter", 400);
      }

      if (currentPassword === newPassword) {
        return jsonError(
          "Password baru tidak boleh sama dengan password lama",
          400,
        );
      }

      const user = await User.findById(authUser._id).select("+password");

      if (!user) {
        return jsonError("User tidak ditemukan", 404);
      }

      const validPassword = await user.comparePassword(currentPassword);

      if (!validPassword) {
        return jsonError("Password lama salah", 401);
      }

      user.password = newPassword;
      await user.save();

      return NextResponse.json({
        message: "Password berhasil diubah",
      });
    }

    if (action === "note") {
      const user = await getAuthUser(request);
      const id = getId(request);

      if (!id) {
        return jsonError("ID note wajib diisi", 400);
      }

      const note: any = await Note.findById(id);

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!canEditNote(note, user._id)) {
        return jsonError("Role viewer tidak boleh mengedit note", 403);
      }

      const oldTitle = note.title;
      let titleChanged = false;
      let contentChanged = false;

      if (typeof body.title === "string") {
        const nextTitle = body.title.trim() || "Untitled Note";

        if (nextTitle !== note.title) {
          note.title = nextTitle;
          titleChanged = true;
        }
      }

      if (typeof body.content === "string" && body.content !== note.content) {
        note.content = body.content;
        contentChanged = true;
      }

      if (titleChanged || contentChanged) {
        note.lastEditedBy = user._id;
        await note.save();

        let actionType: "update_title" | "update_content" | "update_note" =
          "update_note";
        let message = `${user.name} memperbarui note "${note.title}".`;

        if (titleChanged && !contentChanged) {
          actionType = "update_title";
          message = `${user.name} mengubah judul note dari "${oldTitle}" menjadi "${note.title}".`;
        }

        if (!titleChanged && contentChanged) {
          actionType = "update_content";
          message = `${user.name} mengubah isi note "${note.title}".`;
        }

        if (titleChanged && contentChanged) {
          actionType = "update_note";
          message = `${user.name} mengubah judul dan isi note "${note.title}".`;
        }

        await createActivity({
          note: String(note._id),
          user: String(user._id),
          action: actionType,
          message,
        });
      }

      const populatedNote = await populateNote(Note.findById(note._id));

      return NextResponse.json(populatedNote);
    }

    return jsonError("Action tidak ditemukan", 404);
  } catch (error: any) {
    const result = normalizeError(error);
    return jsonError(result.message, result.status);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDatabase();

    const action = request.nextUrl.searchParams.get("action");

    if (action === "note") {
      const user = await getAuthUser(request);
      const id = getId(request);

      if (!id) {
        return jsonError("ID note wajib diisi", 400);
      }

      const note: any = await Note.findById(id);

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!isOwner(note, user._id)) {
        return jsonError("Hanya owner yang boleh menghapus note", 403);
      }

      await createActivity({
        note: String(note._id),
        user: String(user._id),
        action: "delete",
        message: `${user.name} menghapus note "${note.title}".`,
      });

      await ActivityLog.deleteMany({ note: note._id });
      await note.deleteOne();

      return NextResponse.json({
        message: "Note berhasil dihapus",
      });
    }

    if (action === "collaborator") {
      const user = await getAuthUser(request);
      const id = getId(request);
      const userId = getUserId(request);

      if (!id || !userId) {
        return jsonError("ID note dan userId wajib diisi", 400);
      }

      const note: any = await Note.findById(id);

      if (!note) {
        return jsonError("Note tidak ditemukan", 404);
      }

      if (!isOwner(note, user._id)) {
        return jsonError("Hanya owner yang boleh menghapus collaborator", 403);
      }

      const targetUser = await User.findById(userId).select(
        "_id name email avatar",
      );

      if (!targetUser) {
        return jsonError("User tidak ditemukan", 404);
      }

      note.collaborators = note.collaborators.filter((item: any) => {
        return String(item.user) !== String(userId) || item.role === "owner";
      });

      await note.save();

      await createActivity({
        note: String(note._id),
        user: String(user._id),
        action: "remove_collaborator",
        message: `${user.name} menghapus akses ${targetUser.name} dari note "${note.title}".`,
      });

      const populatedNote = await populateNote(Note.findById(note._id));

      return NextResponse.json(populatedNote);
    }

    return jsonError("Action tidak ditemukan", 404);
  } catch (error: any) {
    const result = normalizeError(error);
    return jsonError(result.message, result.status);
  }
}

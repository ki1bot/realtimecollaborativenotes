import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/app/lib/auth";
import { connectDatabase } from "@/app/lib/db";
import { generateToken } from "@/app/lib/jwt";
import { canEditNote, canViewNote, isOwner } from "@/app/lib/permissions";
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

      return NextResponse.json([]);
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

    if (action === "notes") {
      const user = await getAuthUser(request);
      const title = body.title?.trim() || "Untitled Note";
      const content = body.content || "";

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
      } else {
        note.collaborators.push({
          user: targetUser._id,
          role: selectedRole,
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

      let hasChanges = false;

      if (typeof body.title === "string" && body.title.trim() !== note.title) {
        note.title = body.title.trim() || "Untitled Note";
        hasChanges = true;
      }

      if (typeof body.content === "string" && body.content !== note.content) {
        note.content = body.content;
        hasChanges = true;
      }

      if (hasChanges) {
        note.lastEditedBy = user._id;
        await note.save();
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

      note.collaborators = note.collaborators.filter((item: any) => {
        return String(item.user) !== String(userId) || item.role === "owner";
      });

      await note.save();

      const populatedNote = await populateNote(Note.findById(note._id));

      return NextResponse.json(populatedNote);
    }

    return jsonError("Action tidak ditemukan", 404);
  } catch (error: any) {
    const result = normalizeError(error);
    return jsonError(result.message, result.status);
  }
}

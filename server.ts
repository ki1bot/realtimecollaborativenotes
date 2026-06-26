import "dotenv/config";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { connectDatabase } from "./app/lib/db";
import { canEditNote, canViewNote } from "./app/lib/permissions";
import ActivityLog from "./app/models/ActivityLog";
import Note from "./app/models/Note";
import User from "./app/models/User";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();
const port = Number(process.env.PORT || 3000);

type SocketUser = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
};

const rooms = new Map<string, Map<string, SocketUser>>();

const serializeUser = (user: any): SocketUser => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  avatar: user.avatar || "",
});

const getRoom = (noteId: string) => {
  if (!rooms.has(noteId)) {
    rooms.set(noteId, new Map());
  }

  return rooms.get(noteId)!;
};

const emitOnlineUsers = (io: Server, noteId: string) => {
  const room = getRoom(noteId);
  io.to(noteId).emit("online_users", Array.from(room.values()));
};

const createActivity = async ({
  noteId,
  userId,
  action,
  message,
}: {
  noteId: string;
  userId: string;
  action: string;
  message: string;
}) => {
  const activity = await ActivityLog.create({
    note: noteId,
    user: userId,
    action,
    message,
  });

  return activity.populate("user", "_id name email avatar");
};

app.prepare().then(async () => {
  await connectDatabase();

  const server = createServer((req, res) => {
    handler(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(async (socket, nextMiddleware) => {
    try {
      const token = socket.handshake.auth?.token;
      const jwtSecret = process.env.JWT_SECRET;

      if (!token) {
        return nextMiddleware(new Error("Token tidak ditemukan"));
      }

      if (!jwtSecret) {
        return nextMiddleware(new Error("JWT_SECRET belum diisi"));
      }

      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return nextMiddleware(new Error("User tidak valid"));
      }

      socket.data.user = user;
      socket.data.noteIds = new Set<string>();
      nextMiddleware();
    } catch {
      nextMiddleware(new Error("Autentikasi socket gagal"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_note", async ({ noteId }: { noteId: string }) => {
      try {
        const user = socket.data.user;
        const note = await Note.findById(noteId);

        if (!note || !canViewNote(note, user._id)) {
          socket.emit("error_message", "Kamu tidak punya akses ke note ini");
          return;
        }

        socket.join(noteId);
        socket.data.noteIds.add(noteId);

        const room = getRoom(noteId);
        const serializedUser = serializeUser(user);
        room.set(String(user._id), serializedUser);

        const activity = await createActivity({
          noteId,
          userId: String(user._id),
          action: "joined",
          message: `${user.name} joined this note`,
        });

        socket.to(noteId).emit("user_joined_note", serializedUser);
        io.to(noteId).emit("activity_created", activity);
        emitOnlineUsers(io, noteId);
      } catch {
        socket.emit("error_message", "Gagal bergabung ke note");
      }
    });

    socket.on("leave_note", ({ noteId }: { noteId: string }) => {
      const user = socket.data.user;
      const room = getRoom(noteId);
      const userId = String(user._id);

      if (room.has(userId)) {
        room.delete(userId);
        socket.leave(noteId);
        io.to(noteId).emit("user_left_note", userId);
        emitOnlineUsers(io, noteId);
      }

      if (room.size === 0) {
        rooms.delete(noteId);
      }

      socket.data.noteIds.delete(noteId);
    });

    socket.on(
      "note_title_update",
      async ({ noteId, title }: { noteId: string; title: string }) => {
        try {
          const user = socket.data.user;
          const note = await Note.findById(noteId);

          if (!note || !canEditNote(note, user._id)) {
            socket.emit(
              "error_message",
              "Kamu tidak boleh mengubah judul note",
            );
            return;
          }

          note.title = title?.trim() || "Untitled Note";
          note.lastEditedBy = user._id;
          await note.save();

          const activity = await createActivity({
            noteId,
            userId: String(user._id),
            action: "title_updated",
            message: `${user.name} updated the title`,
          });

          io.to(noteId).emit("note_title_updated", {
            title: note.title,
            updatedBy: serializeUser(user),
          });

          io.to(noteId).emit("activity_created", activity);
        } catch {
          socket.emit("error_message", "Gagal mengubah judul note");
        }
      },
    );

    socket.on(
      "note_content_update",
      async ({ noteId, content }: { noteId: string; content: string }) => {
        try {
          const user = socket.data.user;
          const note = await Note.findById(noteId);

          if (!note || !canEditNote(note, user._id)) {
            socket.emit(
              "error_message",
              "Kamu tidak boleh mengubah konten note",
            );
            return;
          }

          note.content = content || "";
          note.lastEditedBy = user._id;
          await note.save();

          const activity = await createActivity({
            noteId,
            userId: String(user._id),
            action: "content_updated",
            message: `${user.name} edited this note`,
          });

          io.to(noteId).emit("note_content_updated", {
            content: note.content,
            updatedBy: serializeUser(user),
          });

          io.to(noteId).emit("activity_created", activity);
        } catch {
          socket.emit("error_message", "Gagal menyimpan konten note");
        }
      },
    );

    socket.on("typing_start", ({ noteId }: { noteId: string }) => {
      socket.to(noteId).emit("user_typing", serializeUser(socket.data.user));
    });

    socket.on("typing_stop", ({ noteId }: { noteId: string }) => {
      socket.to(noteId).emit("user_stop_typing", String(socket.data.user._id));
    });

    socket.on("disconnect", () => {
      const noteIds = Array.from(
        socket.data.noteIds instanceof Set
          ? socket.data.noteIds
          : new Set<string>(),
      ) as string[];

      for (const noteId of noteIds) {
        const room = getRoom(noteId);
        const userId = String(socket.data.user._id);

        if (room.has(userId)) {
          room.delete(userId);
          socket.leave(noteId);
          io.to(noteId).emit("user_left_note", userId);
          emitOnlineUsers(io, noteId);
        }

        if (room.size === 0) {
          rooms.delete(noteId);
        }
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});

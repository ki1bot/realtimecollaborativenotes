import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/app/types";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export const connectSocket = (token: string): AppSocket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || undefined, {
    auth: { token },
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

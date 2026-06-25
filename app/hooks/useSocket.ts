import { useEffect, useState } from "react";
import {
  connectSocket,
  disconnectSocket,
  type AppSocket,
} from "../services/socketService";

export const useSocket = (token: string | null) => {
  const [socket, setSocket] = useState<AppSocket | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const connectedSocket = connectSocket(token);
    setSocket(connectedSocket);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [token]);

  return socket;
};

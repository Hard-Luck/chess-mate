import { SocketContext } from "@/contexts/SocketContext";
import { useContext } from "react";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  function joinRoom(roomId: string) {
    if (!socket) return;
    socket.emit("joinRoom", roomId);
  }
  return { socket, joinRoom };
};

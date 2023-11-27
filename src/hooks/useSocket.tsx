import { PositionFile, PositionRank } from "@/classes/position";
import { SocketContext } from "@/contexts/SocketContext";
import { useContext } from "react";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  function joinRoom(roomId: string) {
    if (!socket) return;
    socket.emit("joinRoom", roomId);
  }

  function sendMove(
    roomId: string,
    move: {
      toFile: PositionFile;
      toRank: PositionRank;
      fromFile: PositionFile;
      fromRank: PositionRank;
    }
  ) {
    if (!socket) return;
    if (!roomId) return;
    socket.emit("sendMessageToRoom", {
      newGame: false,
      roomId,
      message: { move },
    });
  }

  return { socket, sendMove, joinRoom };
};

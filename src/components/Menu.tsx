import { useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { useSocket } from "@/hooks/useSocket";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ThemeDropDown from "./ThemeDropDown";
import CopyUrlButton from "./CopyUrlButton";
import { Button } from "./ui/button";

export default function Menu() {
  const { socket, joinRoom } = useSocket();
  const { setPlayerColor } = useGame();
  const [params, setParams] = useSearchParams();
  const roomId = params.get("roomId");

  useEffect(() => {
    if (!roomId) {
      const newRoomId = uuidv4();
      setParams({ roomId: newRoomId });
    }
  }, [roomId, setParams]);
  useEffect(() => {
    if (socket && roomId) {
      joinRoom(roomId);
    }
    return () => {
      if (socket) {
        socket.emit("leaveRoom", roomId);
      }
    };
  }, [roomId, socket, joinRoom]);

  function startGame() {
    if (socket && roomId) {
      const color = Math.random() < 0.5 ? "white" : "black";
      socket.emit("sendMessageToRoom", {
        roomId,
        message: { newGame: true, playerColour: color },
      });
      setPlayerColor(color);
    }
  }

  return (
    <div className="bg-black rounded-lg text-white flex flex-col max-h-64 p-2 gap-2">
      <Button onClick={startGame}>Start game</Button>
      <CopyUrlButton />
      <ThemeDropDown />
    </div>
  );
}

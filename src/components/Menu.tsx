import { useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { useSocket } from "@/hooks/useSocket";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Menu() {
  const { socket, joinRoom } = useSocket();
  const { setPlayerColor } = useGame();
  const [params, setParams] = useSearchParams();
  let roomId = params.get("roomId");

  useEffect(() => {
    if (!roomId) {
      const newRoomId = uuidv4();
      setParams({ roomId: newRoomId });
      roomId = newRoomId;
    }
    joinRoom(roomId);
  }, [roomId, setParams]);

  function startGame() {
    if (socket && roomId) {
      console.log(roomId);
      const color = Math.random() < 0.5 ? "white" : "black";
      socket.emit("sendMessageToRoom", {
        roomId,
        message: { newGame: true, playerColour: color },
      });
      setPlayerColor(color);
    }
  }

  return (
    <div>
      <p>{roomId}</p>
      <div className="bg-green-500">
        <button onClick={startGame}>start game</button>
      </div>
    </div>
  );
}

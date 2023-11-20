import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useGame from "@/hooks/useGame";
import Position, { PositionFile, PositionRank } from "@/classes/position";
import Square from "@/components/Square";
import { useSocket } from "@/hooks/useSocket";

function Multiplayer() {
  const socket = useSocket();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [playerColour, setPlayerCoulour] = useState<"white" | "black" | null>(
    "black"
  );
  const { board, resetGame, selectSquare, turnColor, possibleMoves, makeMove } =
    useGame(playerColour, sendMove);
  const [size, setSize] = useState(
    Math.min(window.innerWidth * 0.1, window.innerHeight * 0.1)
  );
  useEffect(() => {
    const handleResize = () => {
      const newSize = Math.min(
        window.innerWidth * 0.1,
        window.innerHeight * 0.1
      );
      setSize(newSize);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boardSize = size * 8;
  const boardView = board.slice();
  if (playerColour !== "black") boardView.reverse();
  useEffect(() => {
    if (roomId && socket) {
      socket.on(
        "message",
        (message: {
          newGame: boolean;
          playerColour: "white" | "black";
          move?: {
            toFile: PositionFile;
            toRank: PositionRank;
            fromFile: PositionFile;
            fromRank: PositionRank;
          };
        }) => {
          if (message.newGame) {
            setPlayerCoulour(
              message.playerColour === "black" ? "white" : "black"
            );
          }
          if (message.move) {
            const from = Position.from(
              message.move.fromFile,
              message.move.fromRank
            );
            const to = Position.from(message.move.toFile, message.move.toRank);
            makeMove(from, to);
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("connect");
        if (roomId) {
          socket.off(roomId);
        }
      }
    };
  }, [roomId]);
  function sendMove(move: {
    toFile: PositionFile;
    toRank: PositionRank;
    fromFile: PositionFile;
    fromRank: PositionRank;
  }) {
    if (!socket) return;
    if (!roomId) return;
    socket.emit("sendMessageToRoom", {
      newGame: false,
      roomId,
      message: { move },
    });
  }
  function generateRoomId() {
    if (!socket) return;
    const newRoomId = uuidv4();
    console.log(newRoomId);
    setRoomId(newRoomId);
    socket.emit("joinRoom", newRoomId);
    setRoomIdInput("");
  }

  function handleRoomIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    setRoomIdInput(e.target.value);
  }

  function joinRoom() {
    if (!socket) return;
    socket.emit("joinRoom", roomIdInput);
    setRoomId(roomIdInput);
  }

  function startGame() {
    if (socket) {
      if (!roomId) return;
      console.log(roomId);
      const color = Math.random() < 0.5 ? "white" : "black";
      socket.emit("sendMessageToRoom", {
        roomId,
        message: { newGame: true, playerColour: color },
      });
      setPlayerCoulour(color);
    }
  }

  return (
    <>
      <main className="bg-slate-400">
        <div className="joinRoom">
          <p>{roomId}</p>
          <button onClick={() => generateRoomId()}>Set Room ID</button>
          <input
            className="border-black border-2"
            onChange={handleRoomIdInput}
            type="text"
            value={roomIdInput}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div className="bg-green-500">
          <button onClick={startGame}>start game</button>
        </div>
        <div
          className={`grid grid-cols-8`}
          style={{ width: boardSize, height: boardSize, margin: "auto" }}
          onMouseDown={selectSquare}>
          {boardView.map((rank, i) => {
            const whiteView = rank.map((piece, j) => {
              const file = String.fromCharCode(j + 65) as PositionFile;
              const rank =
                playerColour === "white"
                  ? ((8 - i) as PositionRank)
                  : ((i + 1) as PositionRank);
              return (
                <Square
                  key={`${file}${rank}`}
                  file={file}
                  rank={rank}
                  piece={piece}
                  size={size}
                  selected={possibleMoves[`${file}${rank}`]}
                />
              );
            });
            if (playerColour !== "white") whiteView.reverse();
            return whiteView;
          })}
        </div>
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="m-2 p-2 bg-blue-500 text-white">
            Reset
          </button>
          <p>{turnColor} to play</p>
        </div>
      </main>
    </>
  );
}
export default Multiplayer;

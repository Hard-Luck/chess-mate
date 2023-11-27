import Position, { PositionFile, PositionRank } from "@/classes/position";
import { useGame } from "@/hooks/useGame";
import { useEffect, useState } from "react";
import Square from "./Square";
import { useSocket } from "@/hooks/useSocket";
import { useSearchParams } from "react-router-dom";

export default function Board() {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const { socket } = useSocket();
  const {
    board,
    resetGame,
    selectSquare,
    turnColor,
    possibleMoves,
    playerColor,
    setPlayerColor,
    makeMove,
  } = useGame();
  const [size, setSize] = useState(
    Math.min(window.innerWidth * 0.1, window.innerHeight * 0.1)
  );
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
            setPlayerColor(
              message.playerColour === "black" ? "white" : "black"
            );
          }
          if (message.move && message.playerColour !== playerColor) {
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
  }, [socket, makeMove, playerColor, roomId, setPlayerColor]);

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
  if (playerColor !== "black") boardView.reverse();
  return (
    <>
      <div
        className={`grid grid-cols-8`}
        style={{ width: boardSize, height: boardSize, margin: "auto" }}
        onMouseDown={selectSquare}>
        {boardView.map((rank, i) => {
          const whiteView = rank.map((piece, j) => {
            const file = String.fromCharCode(j + 65) as PositionFile;
            const rank =
              playerColor === "white"
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
          if (playerColor !== "white") whiteView.reverse();
          return whiteView;
        })}
      </div>
      <div className="flex justify-center">
        <button onClick={resetGame} className="m-2 p-2 bg-blue-500 text-white">
          Reset
        </button>
        <p>{turnColor} to play</p>
      </div>
    </>
  );
}

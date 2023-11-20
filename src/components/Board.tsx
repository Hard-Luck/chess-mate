import { PositionFile, PositionRank } from "@/classes/position";
import useGame from "@/hooks/useGame";
import { useEffect, useState } from "react";
import Square from "./Square";

export default function Board({
  playerColour,
  onMove,
}: {
  playerColour: "white" | "black" | null;
  onMove: (move: {
    toFile: PositionFile;
    toRank: PositionRank;
    fromFile: PositionFile;
    fromRank: PositionRank;
  }) => void;
}) {
  const { board, resetGame, selectSquare, turnColor, possibleMoves, makeMove } =
    useGame(playerColour, onMove);
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
        <button onClick={resetGame} className="m-2 p-2 bg-blue-500 text-white">
          Reset
        </button>
        <p>{turnColor} to play</p>
      </div>
    </>
  );
}

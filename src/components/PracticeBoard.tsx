import { useEffect, useState } from "react";
import type { PositionFile, PositionRank } from "../classes/position";
import Square from "./Square";
import useGame from "@/hooks/useGame";

function PracticeBoard() {
  const { board, resetGame, selectSquare, turnColor, possibleMoves } = useGame(
    null,
    () => {}
  );
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

  return (
    <>
      <div
        className={`grid grid-cols-8`}
        style={{ width: boardSize, height: boardSize, margin: "auto" }}
        onMouseDown={selectSquare}>
        {board
          .slice()
          .reverse()
          .map((rank, i) => {
            return rank.map((piece, j) => {
              const file = String.fromCharCode(j + 65) as PositionFile;
              const rank = (8 - i) as PositionRank;
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
export default PracticeBoard;

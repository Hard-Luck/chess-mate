import { useEffect, useState } from "react";
import type { PositionFile, PositionRank } from "../classes/position";
import Square from "./Square";
import useGame from "@/hooks/useGame";

function Board() {
  const { board, resetGame, selectSquare } = useGame();
  const [size, setSize] = useState(window.innerWidth * 0.1);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth * 0.1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`grid grid-cols-8 w-4/5 mx-auto`}
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
                />
              );
            });
          })}
      </div>
      <div className="flex justify-center">
        <button onClick={resetGame} className="m-2 p-2 bg-blue-500 text-white">
          Reset
        </button>
      </div>
    </>
  );
}
export default Board;

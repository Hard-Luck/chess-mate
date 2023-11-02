import { useEffect, useState } from "react";
import Game from "../classes/game";
import type { PositionFile, PositionRank } from "../classes/position";
import Square from "./Square";

function Board() {
  const [game, setGame] = useState(new Game());
  const [board, setBoard] = useState(game.state);
  const [size, setSize] = useState(window.innerWidth * 0.1);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth * 0.1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function resetGame() {
    const newGame = new Game();
    setBoard(() => newGame.state);
    setGame(() => newGame);
  }
  function move() {
    const newBoard = game.makeMove(["A", 2], ["A", 4]);
    setBoard(newBoard);
  }

  return (
    <>
      <div
        className={`grid grid-cols-8 w-4/5 mx-auto`}
        onMouseDown={(e) => {
          console.log((e.target as HTMLElement).dataset.location);
        }}>
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
        <button onClick={move} className="m-2 p-2 bg-blue-500 text-white">
          Test Move
        </button>
      </div>
    </>
  );
}
export default Board;

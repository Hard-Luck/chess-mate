import Game from "@/classes/game";
import Position from "@/classes/position";
import { useState } from "react";

function useGame() {
  const [game, setGame] = useState(new Game());
  const [board, setBoard] = useState(game.state);

  function resetGame() {
    const newGame = new Game();
    setBoard(() => newGame.state);
    setGame(() => newGame);
  }
  function move() {
    const newBoard = game.makeMove(new Position("A", 2), new Position("A", 4));
    setBoard(newBoard);
  }
  function selectSquare(e: React.MouseEvent<HTMLElement>) {
    const startLocation = (e.target as HTMLElement).dataset.location;
    if (!startLocation) return;
    const pos = Position.from(startLocation[0], startLocation[1]);
    const end = Position.from(startLocation[0], +startLocation[1] + 1);
    console.log(pos, end);

    const newBoard = game.makeMove(pos, end);
    setBoard(newBoard);
  }
  return { board, resetGame, move, selectSquare };
}
export default useGame;

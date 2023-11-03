import Game from "@/classes/game";
import Position from "@/classes/position";
import { useState } from "react";

function useGame() {
  const [game, setGame] = useState(new Game());
  const [board, setBoard] = useState(game.state);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);

  function resetGame() {
    const newGame = new Game();
    setBoard(() => newGame.state);
    setGame(() => newGame);
    setSelectedSquare(null);
  }
  function selectSquare(e: React.MouseEvent) {
    const square = (e.target as HTMLElement).dataset.location;
    if (!square) return;
    const position = Position.from(square[0], square[1]);
    if (selectedSquare === null) {
      setSelectedSquare(position);
    } else {
      try {
        const newBoard = game.makeMove(selectedSquare, position);
        setSelectedSquare(null);
        setBoard(newBoard);
      } catch (err) {
        setSelectedSquare(null);
      }
    }
  }
  return { board, resetGame, move, selectSquare };
}
export default useGame;

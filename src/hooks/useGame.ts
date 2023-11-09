import Game from "@/classes/game";
import Position from "@/classes/position";
import { useState } from "react";

function useGame() {
  const [game, setGame] = useState(new Game());
  const [board, setBoard] = useState(game.state);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Record<string, boolean>>(
    {}
  );
  const turnColor = game.turnColor;
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
    const piece = game.getPieceAtPosition(position);
    if (selectedSquare === null) {
      if (piece?.pieceColor === game.turnColor) {
        setSelectedSquare(position);
        const possibleMoves =
          game.possibleMovesFor(piece) || ([] as Position[]);
        const movesIndexes = possibleMoves.reduce<Record<string, boolean>>(
          (acc, curr) => {
            const index = `${curr.currentFile}${curr.currentRank}` as string;
            acc[index] = true;
            return acc;
          },
          {}
        );
        setPossibleMoves(movesIndexes);
      }
    } else {
      try {
        const newBoard = game.makeMove(selectedSquare, position);
        setSelectedSquare(null);
        setBoard(newBoard);
        setPossibleMoves({});
      } catch (err) {
        setSelectedSquare(null);
        setPossibleMoves({});
      }
    }
  }
  return { board, resetGame, selectSquare, turnColor, possibleMoves };
}
export default useGame;

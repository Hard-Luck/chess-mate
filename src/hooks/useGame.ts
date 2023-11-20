import Game from "@/classes/game";
import Position, { PositionFile, PositionRank } from "@/classes/position";
import { useState } from "react";
type socketMove = {
  toFile: PositionFile;
  toRank: PositionRank;
  fromFile: PositionFile;
  fromRank: PositionRank;
};
function useGame(
  playerColour: "white" | "black" | null,
  onMove: (move: socketMove) => void
) {
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
    if (game.turnColor !== playerColour) return;
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
      makeMove(selectedSquare, position);
      onMove({
        toFile: position.currentFile,
        toRank: position.currentRank,
        fromFile: selectedSquare.currentFile,
        fromRank: selectedSquare.currentRank,
      });
    }
  }
  function makeMove(to: Position, from: Position) {
    try {
      const newBoard = game.makeMove(to, from);
      setSelectedSquare(null);
      setBoard(newBoard);
      setPossibleMoves({});
    } catch (err) {
      setSelectedSquare(null);
      setPossibleMoves({});
    }
  }
  return { board, resetGame, selectSquare, turnColor, possibleMoves, makeMove };
}
export default useGame;

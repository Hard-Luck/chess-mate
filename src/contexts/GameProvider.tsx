import React, { useState, PropsWithChildren } from "react";
import Game from "@/classes/game";
import Position from "@/classes/position";
import GameContext from "./GameContext"; // Path to your GameContext

const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [game, setGame] = useState(new Game());
  const [board, setBoard] = useState(game.state);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Record<string, boolean>>(
    {}
  );
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    "white"
  );
  const turnColor = game.turnColor;

  // Reset game function
  const resetGame = () => {
    const newGame = new Game();
    setBoard(() => newGame.state);
    setGame(() => newGame);
    setSelectedSquare(null);
  };

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
      makeMove(selectedSquare, position);
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

  // Context value that will be provided to the children
  const contextValue = {
    game,
    setGame,
    board,
    setBoard,
    selectSquare,
    selectedSquare,
    setSelectedSquare,
    possibleMoves,
    setPossibleMoves,
    turnColor,
    resetGame,
    makeMove,
    playerColor,
    setPlayerColor,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameProvider;

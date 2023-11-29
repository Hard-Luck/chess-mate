import React, { useState, PropsWithChildren } from "react";
import Game from "@/classes/game";
import Position from "@/classes/position";
import GameContext from "./GameContext";
import { useSearchParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { PositionFile, PositionRank } from "@/classes/position";

type MoveType = {
  toFile: PositionFile;
  toRank: PositionRank;
  fromFile: PositionFile;
  fromRank: PositionRank;
};
const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [params] = useSearchParams();
  const { socket } = useSocket();
  const roomId = params.get("roomId");
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
  function startGame() {
    if (socket && roomId) {
      const color = Math.random() < 0.5 ? "white" : "black";
      socket.emit("sendMessageToRoom", {
        roomId,
        message: { newGame: true, playerColour: color },
      });
      setPlayerColor(color);
    }
  }
  const resetGame = () => {
    const newGame = new Game();
    setBoard(() => newGame.state);
    setGame(() => newGame);
    setSelectedSquare(null);
  };
  function sendMove(roomId: string, move: MoveType) {
    if (!socket) return;
    if (!roomId) return;
    socket.emit("sendMessageToRoom", {
      newGame: false,
      roomId,
      message: { move },
    });
  }
  function selectSquare(e: React.MouseEvent) {
    if (game.turnColor !== playerColor) return;
    const square = (e.target as HTMLElement).dataset.location;
    if (!square) return;
    const position = Position.from(square[0], square[1]);
    const piece = game.getPieceAtPosition(position);
    if (selectedSquare === null || piece?.pieceColor === game.turnColor) {
      setSelectedSquare(position);
      const possibleMoves = game.possibleMovesFor(piece) || ([] as Position[]);
      const movesIndexes = possibleMoves.reduce<Record<string, boolean>>(
        (acc, curr) => {
          const index = `${curr.currentFile}${curr.currentRank}` as string;
          acc[index] = true;
          return acc;
        },
        {}
      );
      setPossibleMoves(movesIndexes);
    } else {
      makeMoveAndBroadcast(selectedSquare, position);
    }
  }
  function makeMoveAndBroadcast(from: Position, to: Position) {
    sendMove(roomId!, {
      toFile: to.currentFile,
      toRank: to.currentRank,
      fromFile: from.currentFile,
      fromRank: from.currentRank,
    });
    makeMove(from, to);
  }
  const makeMove = (from: Position, to: Position) => {
    try {
      const newBoard = game.makeMove(from, to);
      setSelectedSquare(null);
      setBoard(newBoard);
      setPossibleMoves({});
    } catch (err) {
      setSelectedSquare(null);
      setPossibleMoves({});
    }
  };

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
    startGame,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameProvider;

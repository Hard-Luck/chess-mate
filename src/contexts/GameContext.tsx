import Game from "@/classes/game";
import Position from "@/classes/position";
import React from "react";

type GameContextType = {
  game: Game;
  playerColor: "white" | "black" | null;
  setPlayerColor: React.Dispatch<
    React.SetStateAction<"white" | "black" | null>
  >;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
  board: Game["state"];
  selectSquare: (e: React.MouseEvent) => void;
  selectedSquare: Position | null;
  setSelectedSquare: React.Dispatch<React.SetStateAction<Position | null>>;
  possibleMoves: Record<string, boolean>;
  setPossibleMoves: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  turnColor: "white" | "black" | null;
  resetGame: () => void;
  makeMove: (to: Position, from: Position) => void;
  startGame: () => void;
};

const GameContext = React.createContext<GameContextType | null>(null);

export default GameContext;

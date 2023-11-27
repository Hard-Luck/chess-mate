import GameContext from "@/contexts/GameContext";
import React from "react";

export const useGame = () => {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameContextProvider");
  }
  return context;
};

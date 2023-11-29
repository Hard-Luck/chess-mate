import { useGame } from "@/hooks/useGame";

function GameInfo() {
  const { turnColor } = useGame();
  return (
    <div
      className={`flex justify-center ${
        turnColor === "white" ? "bg-white" : "bg-black"
      } rounded-lg p-2 m-2
      `}>
      <p
        className={`${
          turnColor === "white" ? "text-black" : "text-white"
        } text-3xl`}>
        {turnColor} to play
      </p>
    </div>
  );
}

export default GameInfo;

import { useGame } from "@/hooks/useGame";

function GameInfo() {
  const { turnColor } = useGame();
  return (
    <div className="flex justify-center bg-white">
      <p className="text-3xl">{turnColor} to play</p>
    </div>
  );
}

export default GameInfo;

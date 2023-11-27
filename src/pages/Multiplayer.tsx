import Menu from "@/components/Menu";
import Board from "@/components/Board";
import GameProvider from "@/contexts/GameProvider";

function Multiplayer() {
  return (
    <GameProvider>
      <div>
        <Menu />
        <Board />
      </div>
    </GameProvider>
  );
}
export default Multiplayer;

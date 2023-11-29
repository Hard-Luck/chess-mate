import Menu from "@/components/Menu";
import Board from "@/components/Board";
import GameInfo from "@/components/GameInfo";

function Multiplayer() {
  const imgUrl = "/chess-bg-black.jpg";
  return (
    <main
      className="bg-fixed bg-center bg-cover h-screen w-full"
      style={{ backgroundImage: `url(${imgUrl})` }}>
      <div className="flex flex-wrap justify-center gap-2">
        <Board />
        <div>
          <Menu />
          <GameInfo />
        </div>
      </div>
    </main>
  );
}
export default Multiplayer;

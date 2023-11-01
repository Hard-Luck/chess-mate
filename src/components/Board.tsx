import Game from "../classes/game";
import type { PositionFile, PositionRank } from "../classes/position";
import Square from "./Square";
import { uniqueId } from "lodash";

function Board() {
  const game = new Game();
  return (
    <div className="flex flex-col">
      {game.state
        .map((rank, i) => {
          return (
            <div className="flex" key={uniqueId()}>
              {rank.map((piece, j) => {
                const file = String.fromCharCode(j + 65) as PositionFile;
                const rank = (i + 1) as PositionRank;
                return (
                  <Square
                    key={uniqueId()}
                    file={file}
                    rank={rank}
                    piece={piece}
                  />
                );
              })}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}

export default Board;

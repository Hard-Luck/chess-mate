import { PositionFile, PositionRank } from "../classes/position";
import { Piece } from "@/classes/game";
interface SquareProps {
  file: PositionFile;
  rank: PositionRank;
  piece: Piece;
}

function Square({ file, rank, piece }: SquareProps) {
  const fileAsNum = "_ABCDEFGH".indexOf(file);
  const colour =
    (rank + fileAsNum) % 2 === 0 ? "bg-black text-white" : "bg-white";
  const imgUrl = piece ? `pieces/${piece.pieceColor}/${piece.type}.png` : null;
  return (
    <div
      className={`w-16 h-16 flex flex-col justify-center text-center ${colour}`}>
      {imgUrl ? (
        <img className="w-14 h-14" src={imgUrl} alt={piece?.type} />
      ) : null}
    </div>
  );
}

export default Square;

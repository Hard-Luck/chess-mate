import { Piece } from "@/classes/game";
import { PositionFile, PositionRank } from "@/classes/position";

interface SquareProps {
  file: PositionFile;
  rank: PositionRank;
  piece: Piece;
  size: number;
}

function Square({ file, rank, piece, size }: SquareProps) {
  const fileAsNum = "_ABCDEFGH".indexOf(file);
  const isDark = (rank + fileAsNum) % 2 === 0;
  const imgUrl = piece ? `pieces/${piece.pieceColor}/${piece.type}.png` : null;
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`flex items-center justify-center ${
        isDark ? "bg-black" : "bg-white"
      }`}>
      {imgUrl ? (
        <img className="w-3/4 h-3/4" src={imgUrl} alt={piece?.type} />
      ) : null}
    </div>
  );
}
export default Square;

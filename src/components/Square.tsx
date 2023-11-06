import { Piece } from "@/classes/game";
import { PositionFile, PositionRank } from "@/classes/position";

interface SquareProps {
  file: PositionFile;
  rank: PositionRank;
  piece: Piece;
  size: number;
  selected: boolean;
}
interface SquareStyle {
  height: string;
  width: string;
  border?: string;
}
function Square({ file, rank, piece, size, selected }: SquareProps) {
  const fileAsNum = "_ABCDEFGH".indexOf(file);
  const isDark = (rank + fileAsNum) % 2 === 0;
  const imgUrl = piece ? `pieces/${piece.pieceColor}/${piece.type}.png` : null;
  let style: SquareStyle = { width: `${size}px`, height: `${size}px` };
  if (selected) style = { ...style, border: "solid 2px red" };
  return (
    <div
      data-location={`${file}${rank}`}
      style={style}
      className={`flex items-center justify-center ${
        isDark ? "bg-black" : "bg-white"
      }`}>
      {imgUrl ? (
        <img
          className="w-3/4 h-3/4"
          data-location={`${file}${rank}`}
          src={imgUrl}
          alt={piece?.type}
        />
      ) : null}
    </div>
  );
}
export default Square;

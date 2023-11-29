import React from "react";
import { Piece } from "@/classes/game";
import { King } from "@/classes/pieces";
import { PositionFile, PositionRank } from "@/classes/position";
import { useTheme } from "@/hooks/useTheme";

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
  backgroundColor?: string;
}
function Square({ file, rank, piece, size, selected }: SquareProps) {
  const { theme } = useTheme();
  const fileAsNum = "_ABCDEFGH".indexOf(file);
  const isDark = (rank + fileAsNum) % 2 === 0;
  const imgUrl = piece ? `pieces/${piece.pieceColor}/${piece.type}.png` : null;
  let style: SquareStyle = { width: `${size}px`, height: `${size}px` };

  const isKing = (piece: Piece): piece is King => {
    if (!piece) return false;
    if (!(piece instanceof King)) return false;
    return true;
  };

  let dotStyle: React.CSSProperties = {};
  if (selected) {
    dotStyle = {
      width: "10px",
      height: "10px",
      backgroundColor: "red",
      borderRadius: "50%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    };
  }

  if (isKing(piece) && piece.checked) {
    style = { ...style, border: "solid 2px blue" };
  }

  return (
    <div
      data-location={`${file}${rank}`}
      style={style}
      className={`flex items-center justify-center relative ${
        isDark ? theme.dark : theme.light
      }`}>
      {selected && <div style={dotStyle}></div>}
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

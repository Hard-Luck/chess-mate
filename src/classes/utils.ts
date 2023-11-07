import { Piece } from "./game";
import { Pawn } from "./pieces";

export function pieceIsPawn(piece: Piece): piece is Pawn {
  return piece?.type === "pawn";
}

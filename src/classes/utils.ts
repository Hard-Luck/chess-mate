import { Piece } from "./game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";

export function pieceIsPawn(piece: Piece): piece is Pawn {
  return piece?.type === "pawn";
}
export function pieceIsKnight(piece: Piece): piece is Knight {
  return piece?.type === "knight";
}
export function pieceIsBishop(piece: Piece): piece is Bishop {
  return piece?.type === "bishop";
}
export function pieceIsQueen(piece: Piece): piece is Queen {
  return piece?.type === "queen";
}
export function pieceIsRook(piece: Piece): piece is Rook {
  return piece?.type === "rook";
}
export function pieceIsKing(piece: Piece): piece is King {
  return piece?.type === "king";
}

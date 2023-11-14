import { Board } from "@/classes/game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "@/classes/pieces";

export const defaultSetUpBoard = [
  [
    new Rook("white", "A", 1),
    new Knight("white", "B", 1),
    new Bishop("white", "C", 1),
    new Queen("white", "D", 1),
    new King("white", "E", 1),
    new Bishop("white", "F", 1),
    new Knight("white", "G", 1),
    new Rook("white", "H", 1),
  ],

  [
    new Pawn("white", "A", 2),
    new Pawn("white", "B", 2),
    new Pawn("white", "C", 2),
    new Pawn("white", "D", 2),
    new Pawn("white", "E", 2),
    new Pawn("white", "F", 2),
    new Pawn("white", "G", 2),
    new Pawn("white", "H", 2),
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    new Pawn("black", "A", 7),
    new Pawn("black", "B", 7),
    new Pawn("black", "C", 7),
    new Pawn("black", "D", 7),
    new Pawn("black", "E", 7),
    new Pawn("black", "F", 7),
    new Pawn("black", "G", 7),
    new Pawn("black", "H", 7),
  ],

  [
    new Rook("black", "A", 8),
    new Knight("black", "B", 8),
    new Bishop("black", "C", 8),
    new Queen("black", "D", 8),
    new King("black", "E", 8),
    new Bishop("black", "F", 8),
    new Knight("black", "G", 8),
    new Rook("black", "H", 8),
  ],
] as Board;

export function generateEmptyChessBoard() {
  return Array.from({ length: 8 }, () => new Array(8).fill(null)) as Board;
}

export const staleMatePosition1 = [
  [null, null, null, null, null, null, null, new King("black", "H", 1)],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, new Queen("white", "G", 6), null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, new King("white", "E", 8), null, null, null],
] as Board;

export const staleMatePosition2 = [
  [new King("black", "A", 1), null, null, null, null, null, null, null],
  [null, null, null, null, null, null, new Rook("white", "B", 7), null],
  [null, null, null, null, null, null, null],
  [null, new Queen("white", "B", 4), null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, new King("white", "E", 1), null, null, null],
] as Board;
export const checkMatePosition1 = [
  [
    new King("black", "A", 1),
    null,
    null,
    null,
    null,
    null,
    new Queen("white", "G", 1),
    null,
  ],
  [null, null, null, null, null, null, new Rook("white", "G", 2), null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, new King("white", "E", 8), null, null, null],
] as Board;

export const checkMatePosition2 = [
  [
    new King("black", "A", 1),
    null,
    new King("white", "C", 1),
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [new Queen("white", "A", 4), null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
] as Board;

export const queenOnBFile = [
  [new King("black", "A", 1), null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, new Queen("white", "B", 4), null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
] as Board;

export const exposingKingPosition = [
  [
    new King("black", "A", 1),
    null,
    new Bishop("black", "C", 1),
    null,
    null,
    null,
    new Queen("white", "G", 1),
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, new King("white", "E", 8), null, null, null],
] as Board;

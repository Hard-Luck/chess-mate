import { Board } from "./game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";

export default class ChessBoard {
  private board: Board;
  constructor(boardState?: Board) {
    this.board = boardState || this.createBoard();
  }
  private createBoard() {
    const board = [
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
    ];
    return board;
  }
  get state() {
    return this.board;
  }
}

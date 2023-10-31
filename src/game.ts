import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import { PositionFile, PositionRank } from "./position";

type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;

type Square = `${PositionFile}${PositionRank}`;
type Board = Record<Square, Piece>;

export default class Game {
  private board: Board;
  constructor() {
    this.board = this.createBoard();
  }
  private createBoard() {
    const files = "ABCDEFGH".split("");
    const ranks = [3, 4, 5, 6];
    const board: Partial<Board> = {
      A1: new Rook("white", "A", 1),
      B1: new Knight("white", "B", 1),
      C1: new Bishop("white", "C", 1),
      D1: new Queen("white", "D", 1),
      E1: new King("white", "E", 1),
      F1: new Bishop("white", "F", 1),
      G1: new Knight("white", "G", 1),
      H1: new Rook("white", "H", 1),

      A2: new Pawn("white", "A", 2),
      B2: new Pawn("white", "B", 2),
      C2: new Pawn("white", "C", 2),
      D2: new Pawn("white", "D", 2),
      E2: new Pawn("white", "E", 2),
      F2: new Pawn("white", "F", 2),
      G2: new Pawn("white", "G", 2),
      H2: new Pawn("white", "H", 2),

      A7: new Pawn("black", "A", 7),
      B7: new Pawn("black", "B", 7),
      C7: new Pawn("black", "C", 7),
      D7: new Pawn("black", "D", 7),
      E7: new Pawn("black", "E", 7),
      F7: new Pawn("black", "F", 7),
      G7: new Pawn("black", "G", 7),
      H7: new Pawn("black", "H", 7),

      A8: new Rook("black", "A", 8),
      B8: new Knight("black", "B", 8),
      C8: new Bishop("black", "C", 8),
      D8: new Queen("black", "D", 8),
      E8: new King("black", "E", 8),
      F8: new Bishop("black", "F", 8),
      G8: new Knight("black", "G", 8),
      H8: new Rook("black", "H", 8),
    };

    for (const file of files) {
      for (const rank of ranks) {
        const square = `${file}${rank}` as Square;
        board[square] = null;
      }
    }
    return board as Board;
  }
  get state() {
    return this.board;
  }
}

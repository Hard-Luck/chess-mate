import ChessBoard from "./chessboard";
import Rules from "./rules";
import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";

export type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;
export type ShorthandPosition = [PositionFile, PositionRank];
export type Board = Piece[][];
export type Move = [Position, Position];

export default class Game {
  protected chessBoard: ChessBoard;
  private Rules: Rules;

  constructor() {
    this.chessBoard = new ChessBoard();
    this.Rules = new Rules(this.chessBoard);
  }
  get state() {
    return this.chessBoard.state;
  }
  public getPieceAtPosition(position: Position): Piece {
    return this.chessBoard.getPieceFromPosition(position);
  }
  get turnNumber() {
    return this.Rules.moves.turnNumber;
  }
  get turnColor() {
    return this.Rules.moves.playerTurnColor;
  }
  public makeMove(from: Position, to: Position): Board {
    if (this.Rules.isLegalMove(from, to)) {
      this.chessBoard.movePiece(from, to);
      this.Rules.moves.nextPlayer();
    }
    return [...this.chessBoard.state];
  }
}

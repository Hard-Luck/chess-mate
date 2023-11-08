import Rules from "./rules";
import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";
import ChessBoard from "./board";

export type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;
export type ShorthandPosition = [PositionFile, PositionRank];
export type Board = Piece[][];
export type Move = [Position, Position];

export default class Game {
  protected chessBoard: ChessBoard;
  private rules: Rules;

  constructor() {
    this.chessBoard = new ChessBoard();
    this.rules = new Rules(this.chessBoard);
  }
  get state() {
    return this.chessBoard.state;
  }
  public getPieceAtPosition(position: Position): Piece {
    return this.chessBoard.getPieceFromPosition(position);
  }
  get turnNumber() {
    return this.rules.moves.turnNumber;
  }
  get turnColor() {
    return this.rules.moves.playerTurnColor;
  }
  public makeMove(from: Position, to: Position): Board {
    if (this.rules.isLegalEnPassantMove(from, to)) {
      this.rules.captureEnPassant();
    } else if (!this.rules.isLegalMove(from, to)) {
      return this.chessBoard.state;
    }
    this.executeMove(from, to);
    return [...this.chessBoard.state];
  }
  private executeMove(from: Position, to: Position): void {
    this.chessBoard.movePiece(from, to);
    this.rules.moves.nextPlayer();
    this.rules.moves.addMove([from, to]);
  }
}

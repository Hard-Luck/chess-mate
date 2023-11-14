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
  private winningColor: "white" | "black" | "draw" | null;
  constructor() {
    this.chessBoard = new ChessBoard();
    this.rules = new Rules(this.chessBoard);
    this.winningColor = null;
  }
  get state() {
    return this.chessBoard.state;
  }
  get turnNumber() {
    return this.rules.moves.turnNumber;
  }
  get turnColor() {
    return this.rules.moves.playerTurnColor;
  }
  get lastMove() {
    return this.rules.moves.previousMove;
  }
  public possibleMovesFor(piece: Piece): Position[] {
    return this.rules.possibleMovesFor(piece);
  }
  get winner() {
    return this.winningColor;
  }
  public stalemateReached() {
    return this.rules.stalemate();
  }
  public checkmateReached() {
    return this.rules.checkmate();
  }
  public getPieceAtPosition(position: Position): Piece {
    return this.chessBoard.getPieceFromPosition(position);
  }
  public makeMove(from: Position, to: Position): Board {
    if (this.winner !== null) return this.chessBoard.state;
    if (this.rules.isLegalCastleMove(from, to)) {
      this.moveCastledRook(to);
    } else if (this.rules.isLegalEnPassantMove(from, to)) {
      this.rules.captureEnPassant();
    } else if (!this.rules.isLegalMove(from, to)) {
      return this.chessBoard.state;
    }
    this.executeMove(from, to);
    return [...this.chessBoard.state];
  }
  private executeMove(from: Position, to: Position): void {
    this.chessBoard.movePiece(from, to);
    const gameOver = this.endGameCondition();
    this.rules.moves.addMove([from, to]);
    if (gameOver) return;
    this.rules.moves.nextPlayer();
  }
  private moveCastledRook(kingEndSquare: Position) {
    const rank = kingEndSquare.currentRank;
    const rookStartFile = kingEndSquare.currentFile === "C" ? "A" : "H";
    const rookStartSquare = new Position(rookStartFile, rank);
    const rookEndFile = kingEndSquare.currentFile === "G" ? "F" : "D";
    const endSquare = new Position(rookEndFile, rank);
    this.chessBoard.movePiece(rookStartSquare, endSquare);
  }
  private endGameCondition() {
    if (this.stalemateReached()) this.winningColor = "draw";
    else if (this.checkmateReached()) this.winningColor = this.turnColor;
    else return false;
    return true;
  }
}

import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";

export type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;
export type ShorthandPosition = [PositionFile, PositionRank];
export type Board = Piece[][];
export type Move = [Position, Position];

export default class Game {
  private board: Board;
  private lastMove: Move | null;
  private turn: number;
  private playerTurn: "white" | "black";
  constructor() {
    this.board = this.createBoard();
    this.lastMove = null;
    this.turn = 1;
    this.playerTurn = "white";
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
  get mostRecentMove() {
    return this.lastMove;
  }
  get turnNumber() {
    return this.turn;
  }
  get turnColor() {
    return this.playerTurn;
  }
  get previousMove() {
    return this.lastMove;
  }
  public getPieceFromPosition(position: Position) {
    const fileAsNumber = "ABCDEFGH".indexOf(position.currentFile);
    return this.board[position.currentRank - 1][fileAsNumber];
  }
  private setPosition(position: Position, piece: Piece) {
    const fileAsNumber = "ABCDEFGH".indexOf(position.currentFile);
    this.board[position.currentRank - 1][fileAsNumber] = piece;
  }
  public makeMove(startPosition: Position, endPosition: Position) {
    const pieceToMove = this.getPieceFromPosition(startPosition);
    if (!pieceToMove || pieceToMove.pieceColor !== this.playerTurn) {
      throw new Error(`${!pieceToMove}`);
    }
    const endPiece = this.getPieceFromPosition(endPosition);
    pieceToMove.moveTo(endPosition, this);
    if (endPiece) endPiece.isCaptured = true;
    this.setPosition(endPosition, pieceToMove);
    this.setPosition(startPosition, null);
    this.playerTurn = this.playerTurn === "black" ? "white" : "black";
    if (this.playerTurn === "white") ++this.turn;
    this.lastMove = [startPosition, endPosition];
    return [...this.board];
  }
}

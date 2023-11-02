import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";

export type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;
export type ShorthandPosition = [PositionFile, PositionRank];
type Board = Piece[][];

export default class Game {
  private board: Board;
  private lastMove: [Position, Position] | null;
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
  public makeMove(
    startPosition: ShorthandPosition,
    endPosition: ShorthandPosition
  ) {
    const [startRank, startFile] = startPosition;
    const [endRank, endFile] = endPosition;
    const startRankAsNumber = "ABCDEFGH".indexOf(startRank);
    const endRankAsNumber = "ABCDEFGH".indexOf(endRank);
    const pieceToMove = this.board[startFile - 1][startRankAsNumber];
    if (!pieceToMove || pieceToMove.pieceColor !== this.playerTurn) {
      throw new Error("Not your turn");
    }
    const position = new Position(endRank, endFile);
    pieceToMove.moveTo(position);
    this.board[endFile - 1][endRankAsNumber] = pieceToMove;
    this.board[startFile - 1][startRankAsNumber] = null;
    this.playerTurn = this.playerTurn === "black" ? "white" : "black";
    if (this.playerTurn === "white") ++this.turn;
    return [...this.board];
  }
}

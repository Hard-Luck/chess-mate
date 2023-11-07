import ChessBoard from "./chessboard";
import Moves from "./moves";
import { King, Knight, Bishop, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";
import { pieceIsPawn } from "./utils";

export type Piece = King | Queen | Rook | Bishop | Knight | Pawn | null;
export type ShorthandPosition = [PositionFile, PositionRank];
export type Board = Piece[][];
export type Move = [Position, Position];

export default class Game {
  public moves: Moves;
  private chessBoard: ChessBoard;
  private turn: number;
  private playerTurn: "white" | "black";
  constructor() {
    this.chessBoard = new ChessBoard();
    this.moves = new Moves();
    this.turn = 1;
    this.playerTurn = "white";
  }

  get state() {
    return this.chessBoard.state;
  }

  get turnNumber() {
    return this.turn;
  }
  get turnColor() {
    return this.playerTurn;
  }
  private kingLocation(color: "white" | "black") {
    const king = this.chessBoard.state
      .flat()
      .find((piece) => piece?.type === "king" && piece?.pieceColor === color);
    if (!king) throw new Error("king not found");
    return king.currentPosition;
  }
  private inCheck(kingLocation: Position) {
    const king = this.getPieceFromPosition(kingLocation);
    const { currentRank: rank, currentFile: file } = kingLocation;
    for (const piece of this.chessBoard.state.flat()) {
      if (piece?.pieceColor !== king?.pieceColor) {
        const availableMoves = piece?.availableMoves(this);
        if (!availableMoves) continue;
        for (const move of availableMoves) {
          if (move.currentRank === rank && move.currentFile === file) {
            return true;
          }
        }
      }
    }
    return false;
  }
  public getPieceFromPosition(position: Position) {
    const fileAsNumber = "ABCDEFGH".indexOf(position.currentFile);
    return this.chessBoard.state[position.currentRank - 1][fileAsNumber];
  }
  private setPosition(position: Position, piece: Piece) {
    const fileAsNumber = "ABCDEFGH".indexOf(position.currentFile);
    this.chessBoard.state[position.currentRank - 1][fileAsNumber] = piece;
  }
  public makeMove(startPosition: Position, endPosition: Position) {
    const pieceToMove = this.getPieceFromPosition(startPosition);
    if (!pieceToMove || pieceToMove.pieceColor !== this.playerTurn) {
      throw new Error(`${!pieceToMove}`);
    }
    const forward = this.playerTurn === "white" ? 1 : -1;
    if (pieceIsPawn(pieceToMove) && pieceToMove.checkEnPassant(this)) {
      const enPassantPosition = new Position(
        endPosition.currentFile,
        (endPosition.currentRank - forward) as PositionRank
      );
      const enPassantPiece = this.getPieceFromPosition(enPassantPosition);
      if (enPassantPiece) {
        enPassantPiece.isCaptured = true;
        this.setPosition(startPosition, null);
        this.setPosition(enPassantPosition, null);
        this.setPosition(endPosition, pieceToMove);
        this.playerTurn = this.playerTurn === "black" ? "white" : "black";
        if (this.playerTurn === "white") ++this.turn;
        this.moves.addMove([startPosition, enPassantPosition]);
        const opponentsKingLocation = this.kingLocation(this.playerTurn);
        if (this.inCheck(opponentsKingLocation)) {
          const king = this.getPieceFromPosition(opponentsKingLocation) as King;
          king.checked = true;
        }
        return [...this.chessBoard.state];
      }
    }
    const endPiece = this.getPieceFromPosition(endPosition);
    pieceToMove.moveTo(endPosition, this);
    if (endPiece?.pieceColor === pieceToMove.pieceColor) {
      throw new Error("Cannot capture own piece");
    }
    endPiece && (endPiece.isCaptured = true);
    this.setPosition(endPosition, pieceToMove);
    this.setPosition(startPosition, null);
    this.playerTurn = this.playerTurn === "black" ? "white" : "black";
    if (this.playerTurn === "white") ++this.turn;
    this.moves.addMove([startPosition, endPosition]);
    const opponentsKingLocation = this.kingLocation(this.playerTurn);
    if (this.inCheck(opponentsKingLocation)) {
      const king = this.getPieceFromPosition(opponentsKingLocation) as King;
      king.checked = true;
    }
    return [...this.chessBoard.state];
  }
}

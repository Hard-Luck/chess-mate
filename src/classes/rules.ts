import ChessBoard from "./board";
import { Piece } from "./game";
import Moves from "./moves";
import Position from "./position";
import { pieceIsKing, pieceIsPawn } from "./utils";
import {
  KingMoveValidator,
  PawnMoveValidator,
  ValidatorFactory,
} from "./validators";

class Rules {
  private board: ChessBoard;
  public moves: Moves;
  constructor(board: ChessBoard) {
    this.moves = new Moves();
    this.board = board;
  }

  public stalemate(): boolean {
    const opponentTurnColour = this.moves.opponentTurnColour;
    if (this.inCheck(opponentTurnColour)) {
      return false;
    }
    for (const piece of this.board.state.flat()) {
      if (!piece || piece.pieceColor === this.moves.playerTurnColor) continue;
      if (this.possibleMovesFor(piece).length > 0) return false;
    }
    return true;
  }
  public checkmate(): boolean {
    const opponentTurnColour = this.moves.opponentTurnColour;
    if (!this.inCheck(opponentTurnColour)) {
      return false;
    }
    for (const piece of this.board.state.flat()) {
      if (!piece || piece.pieceColor === this.moves.playerTurnColor) continue;
      if (this.possibleMovesFor(piece).length > 0) return false;
    }
    return true;
  }
  public isLegalCastleMove(from: Position, to: Position) {
    const piece = this.board.getPieceFromPosition(from);
    if (!pieceIsKing(piece)) return false;
    const validator = new KingMoveValidator(this.board, piece, to);
    return validator.validateCastlingMove();
  }
  public isLegalEnPassantMove(from: Position, to: Position) {
    const piece = this.board.getPieceFromPosition(from);
    if (!pieceIsPawn(piece)) return false;
    const validator = new PawnMoveValidator(
      this.board,
      piece,
      to,
      this.moves.previousMove
    );
    return validator.isEnPassantMove();
  }
  public captureEnPassant() {
    if (!this.moves.previousMove) throw new Error("No previous move");
    const previousTo = this.moves.previousMove[1];
    const capturedPiece = this.board.getPieceFromPosition(previousTo);
    if (!capturedPiece) throw new Error("No captured piece");
    capturedPiece.isCaptured = true;
    this.board.setPosition(previousTo, null);
  }
  public isLegalMove(from: Position, to: Position): boolean {
    const piece = this.board.getPieceFromPosition(from);
    if (!piece) return false;
    const validator = ValidatorFactory.getValidator(
      piece,
      this.board,
      to,
      this.moves.previousMove || undefined
    );
    return validator.validateMove();
  }
  public possibleMovesFor(piece: Piece): Position[] {
    if (!piece) throw new Error("Invalid piece");
    const validator = ValidatorFactory.getValidator(
      piece,
      this.board,
      undefined,
      this.moves.previousMove || undefined
    );
    return validator.possibleMoves().filter((position) => {
      return !this.wouldBeInCheck(piece.currentPosition, position);
    });
  }
  public inCheck(color: "white" | "black", kingPosition?: Position) {
    kingPosition ??= this.board.kingLocation(color);
    return this.squareUnderAttack(color, kingPosition);
  }
  public wouldBeInCheck(from: Position, to: Position): boolean {
    const piece = this.board.getPieceFromPosition(from);
    const pieceOnTo = this.board.getPieceFromPosition(to);

    if (!piece) return false;
    this.board.setPosition(from, null);
    this.board.setPosition(to, piece);
    piece.currentPosition = to;
    const kingColor = piece.pieceColor;
    const kingPosition = this.board.kingLocation(kingColor);
    const attacked = this.squareUnderAttack(kingColor, kingPosition);
    this.board.setPosition(from, piece);
    this.board.setPosition(to, pieceOnTo);
    piece.currentPosition = from;
    return attacked;
  }
  private squareUnderAttack(
    color: "white" | "black",
    square: Position
  ): boolean {
    for (const piece of this.board.state.flat()) {
      if (piece === null || piece.pieceColor === color) continue;
      const validator = ValidatorFactory.getValidator(
        piece,
        this.board,
        square
      );
      if (validator.validateMove()) return true;
    }
    return false;
  }
}
export default Rules;

import ChessBoard from "./board";
import { Piece } from "./game";
import Moves from "./moves";
import Position from "./position";
import {
  pieceIsBishop,
  pieceIsKing,
  pieceIsKnight,
  pieceIsPawn,
  pieceIsQueen,
  pieceIsRook,
} from "./utils";
import {
  DiagonalMoveValidator,
  HorizontalMoveValidator,
  KingMoveValidator,
  KnightMoveValidator,
  PawnMoveValidator,
  ValidatorFactory,
  VerticalMoveValidator,
} from "./validators";

class Rules {
  private board: ChessBoard;
  public moves: Moves;
  constructor(board: ChessBoard) {
    this.moves = new Moves();
    this.board = board;
  }
  public stalemate(): boolean {
    return true;
  }
  public checkmate(): boolean {
    return true;
  }
  public isLegalCastleMove(from: Position, to: Position) {
    const piece = this.board.getPieceFromPosition(from);
    if (!pieceIsKing(piece)) return false;
    const validator = new KingMoveValidator(this.board, piece, to);
    return validator.isCastlingMove();
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

    if (pieceIsPawn(piece)) {
      const validator = new PawnMoveValidator(
        this.board,
        piece,
        to,
        this.moves.previousMove
      );
      return validator.validateMove();
    }
    if (pieceIsKnight(piece)) {
      const validator = new KnightMoveValidator(this.board, piece, to);
      return validator.validateMove();
    }
    if (pieceIsBishop(piece)) {
      const validator = new DiagonalMoveValidator(this.board, piece, to);
      return validator.validateMove();
    }
    if (pieceIsRook(piece)) {
      const verticalValidator = new VerticalMoveValidator(
        this.board,
        piece,
        to
      );
      const horizontalValidator = new HorizontalMoveValidator(
        this.board,
        piece,
        to
      );
      return (
        verticalValidator.validateMove() || horizontalValidator.validateMove()
      );
    }
    if (pieceIsQueen(piece)) {
      const verticalValidator = new VerticalMoveValidator(
        this.board,
        piece,
        to
      );
      const horizontalValidator = new HorizontalMoveValidator(
        this.board,
        piece,
        to
      );
      const diagonalValidator = new DiagonalMoveValidator(
        this.board,
        piece,
        to
      );
      return (
        verticalValidator.validateMove() ||
        horizontalValidator.validateMove() ||
        diagonalValidator.validateMove()
      );
    }
    if (pieceIsKing(piece)) {
      const validator = new KingMoveValidator(this.board, piece, to);
      return validator.validateMove();
    }
    return false;
  }
  public possibleMovesFor(piece: Piece): Position[] {
    if (!piece) throw new Error("Invalid piece");
    const validator = ValidatorFactory.getValidator(piece, this.board);
    return validator.possibleMoves();
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
      console.log(piece);
      if (validator.validateMove()) return true;
    }
    return false;
  }
}
export default Rules;

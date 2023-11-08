import ChessBoard from "./board";
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
  VerticalMoveValidator,
} from "./validators";

class Rules {
  private board: ChessBoard;
  public moves: Moves;
  constructor(board: ChessBoard) {
    this.moves = new Moves();
    this.board = board;
  }
  public isLegalEnPassantMove(from: Position, to: Position) {
    const piece = this.board.getPieceFromPosition(from);
    if (!pieceIsPawn(piece)) return false;
    const validator = new PawnMoveValidator(
      piece,
      from,
      to,
      this.board,
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
        piece,
        from,
        to,
        this.board,
        this.moves.previousMove
      );
      return validator.validateMove();
    }
    if (pieceIsKnight(piece)) {
      const validator = new KnightMoveValidator(piece, from, to, this.board);
      return validator.validateMove();
    }
    if (pieceIsBishop(piece)) {
      const validator = new DiagonalMoveValidator(piece, from, to, this.board);
      return validator.validateMove();
    }
    if (pieceIsRook(piece)) {
      const verticalValidator = new VerticalMoveValidator(
        piece,
        from,
        to,
        this.board
      );
      const horizontalValidator = new HorizontalMoveValidator(
        piece,
        from,
        to,
        this.board
      );
      console.log(horizontalValidator.validateMove(), "horizontal");
      console.log(verticalValidator.validateMove(), "vertical");

      return (
        verticalValidator.validateMove() || horizontalValidator.validateMove()
      );
    }
    if (pieceIsQueen(piece)) {
      const verticalValidator = new VerticalMoveValidator(
        piece,
        from,
        to,
        this.board
      );
      const horizontalValidator = new HorizontalMoveValidator(
        piece,
        from,
        to,
        this.board
      );
      const diagonalValidator = new DiagonalMoveValidator(
        piece,
        from,
        to,
        this.board
      );
      return (
        verticalValidator.validateMove() ||
        horizontalValidator.validateMove() ||
        diagonalValidator.validateMove()
      );
    }
    if (pieceIsKing(piece)) {
      const validator = new KingMoveValidator(piece, from, to, this.board);
      return validator.validateMove();
    }
    return false;
  }
}
export default Rules;

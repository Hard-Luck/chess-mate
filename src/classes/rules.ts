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
  VerticalMoveValidator,
} from "./validators";

class Rules {
  private board: ChessBoard;
  public moves: Moves;
  constructor(board: ChessBoard) {
    this.moves = new Moves();
    this.board = board;
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
    if (pieceIsPawn(piece)) {
      const validator = new PawnMoveValidator(
        this.board,
        piece,
        undefined,
        this.moves.previousMove
      );
      return validator.possibleMoves();
    }
    if (pieceIsKnight(piece)) {
      const validator = new KnightMoveValidator(this.board, piece);
      return validator.possibleMoves();
    }
    if (pieceIsBishop(piece)) {
      const validator = new DiagonalMoveValidator(this.board, piece);
      return validator.possibleMoves();
    }
    if (pieceIsRook(piece)) {
      const verticalValidator = new VerticalMoveValidator(this.board, piece);
      const horizontalValidator = new HorizontalMoveValidator(
        this.board,
        piece
      );
      const verticalMoves = verticalValidator.possibleMoves();
      const horizontalMoves = horizontalValidator.possibleMoves();
      return [...verticalMoves, ...horizontalMoves];
    }
    if (pieceIsQueen(piece)) {
      const verticalValidator = new VerticalMoveValidator(this.board, piece);
      const horizontalValidator = new HorizontalMoveValidator(
        this.board,
        piece
      );
      const diagonalValidator = new DiagonalMoveValidator(this.board, piece);
      const verticalMoves = verticalValidator.possibleMoves();
      const horizontalMoves = horizontalValidator.possibleMoves();
      const diagonalMoves = diagonalValidator.possibleMoves();
      return [...verticalMoves, ...horizontalMoves, ...diagonalMoves];
    }
    if (pieceIsKing(piece)) {
      const validator = new KingMoveValidator(this.board, piece);
      return validator.possibleMoves();
    }
    throw new Error("Invalid piece");
  }
  public inCheck(color: "white" | "black", kingPosition?: Position) {
    kingPosition ??= this.board.kingLocation(color);
    for (const piece of this.board.state.flat()) {
      if (piece === null || piece.pieceColor === color) continue;
      if (piece.canMoveTo(kingPosition)) return true;
    }
    return false;
  }
}
export default Rules;

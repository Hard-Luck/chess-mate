import ChessBoard from "./chessboard";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionRank } from "./position";

// TODO - Pawn cant seem to pass anothother piece or even move after they have mpved 2
// No pieces seem to be able to move twice

export type PieceToValidate = Pawn | Rook | Bishop | Knight | Queen | King;
export abstract class MoveValidator<T extends PieceToValidate> {
  protected piece: T;
  protected to: Position;
  protected from: Position;
  protected board: ChessBoard;
  constructor(piece: T, from: Position, to: Position, board: ChessBoard) {
    this.from = from;
    this.to = to;
    this.board = board;
    this.piece = piece;
  }
  public validateMove(): boolean {
    console.log(1);
    if (!this.piece.canMoveTo(this.to)) return false;
    console.log(2);
    const pieceOnEndSquare = this.board.getPieceFromPosition(this.to);
    const ownPiece = pieceOnEndSquare?.pieceColor === this.piece?.pieceColor;
    return !ownPiece;
  }
}

export class PawnMoveValidator extends MoveValidator<Pawn> {
  validateMove(): boolean {
    if (!super.validateMove()) return false;
    const { file, rank } = this.from.distanceFrom(this.to);
    const forward = this.piece.direction;
    if (Math.abs(rank) === 2) {
      const oneSpaceAhead = new Position(
        this.to.currentFile,
        (this.to.currentRank - forward) as PositionRank
      );
      const pieceBetweenCheck = this.board.getPieceFromPosition(oneSpaceAhead);
      if (pieceBetweenCheck) return false;
    }
    if (this.board.getPieceFromPosition(this.to) !== null) return false;
    if (this.piece.onStartRank()) {
      return (rank === forward || rank === forward * 2) && file === 0;
    }
    return rank === forward && file === 0;
  }
}

export class KnightMoveValidator extends MoveValidator<Knight> {
  validateMove(): boolean {
    if (!super.validateMove()) return false;
    return true;
  }
}

export class DiagonalMoveValidator extends MoveValidator<Bishop | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const distance = this.from.distanceFrom(this.to);
    const { rank, file } = distance;
    const absoluteDifference = Math.abs(rank);
    const rankIndex = this.from.currentRank;
    const rankUnits = rank / absoluteDifference;
    const fileUnits = file / absoluteDifference;
    for (let i = 1; i < absoluteDifference; i++) {
      const fileToCheck = ChessBoard.fileFromDistance(
        this.from.currentFile,
        i * fileUnits
      );
      const rankToCheck = rankIndex + i * rankUnits;
      const positionToCheck = Position.from(fileToCheck, rankToCheck);
      if (this.board.getPieceFromPosition(positionToCheck)) {
        return false;
      }
    }
    return true;
  }
}

export class VerticalMoveValidator extends MoveValidator<Rook | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const { rank } = this.from.distanceFrom(this.to);
    const direction = rank > 0 ? 1 : -1;
    const file = this.from.currentFile;
    const startRank = this.from.currentRank;
    for (let i = 1; i < Math.abs(rank); i += 1) {
      if (
        this.board.getPieceFromPosition(
          Position.from(file, startRank + i * direction)
        )
      ) {
        return false;
      }
    }
    return true;
  }
}

export class HorizontalMoveValidator extends MoveValidator<Rook | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const { file } = this.from.distanceFrom(this.to);
    const direction = file > 0 ? 1 : -1;
    for (let i = 1; i < Math.abs(file); i += 1) {
      const fileToCheck = ChessBoard.fileFromDistance(
        this.from.currentFile,
        i * direction
      );
      const current = Position.from(fileToCheck, this.from.currentRank);
      if (this.board.getPieceFromPosition(current)) {
        return false;
      }
    }
    return true;
  }
}

export class KingMoveValidator extends MoveValidator<King> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    return true;
  }
}

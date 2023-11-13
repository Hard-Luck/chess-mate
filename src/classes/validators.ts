import ChessBoard from "./board";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";
import Position, { PositionFile, PositionRank } from "./position";

export type PieceToValidate = Pawn | Rook | Bishop | Knight | Queen | King;
export abstract class MoveValidator<T extends PieceToValidate> {
  protected board: ChessBoard;
  protected piece: T;
  protected from: Position;
  protected to: Position | null;
  protected potentialMove: Position | null;
  constructor(board: ChessBoard, piece: T, to?: Position) {
    this.from = piece.currentPosition;
    this.to = to || null;
    this.board = board;
    this.piece = piece;
    this.potentialMove = null;
  }
  public validateMove(): boolean {
    const to = this.to || this.potentialMove;
    if (!to) return false;
    if (!this.piece.canMoveTo(to)) return false;
    const pieceOnEndSquare = this.board.getPieceFromPosition(to);
    const ownPiece = pieceOnEndSquare?.pieceColor === this.piece?.pieceColor;
    return !ownPiece;
  }
  abstract possibleMoves(): Position[];
}

export class PawnMoveValidator extends MoveValidator<Pawn> {
  private previousMove: [Position, Position] | null;
  constructor(
    board: ChessBoard,
    piece: Pawn,
    to?: Position,
    previousMove?: [Position, Position] | null
  ) {
    super(board, piece, to);
    this.previousMove = previousMove || null;
    this.potentialMove = null;
  }
  validateMove(): boolean {
    if (!super.validateMove()) return false;
    const to = this.to || this.potentialMove;
    if (!to) return false;
    if (this.isEnPassantMove()) {
      return this.validateEnPassantMove();
    }
    const { file, rank } = this.from.distanceFrom(to);
    const forward = this.piece.direction;
    if (Math.abs(file) === 1) {
      if (this.board.getPieceFromPosition(to) !== null) return true;
      return false;
    }
    const oneSpaceAhead = new Position(
      this.from.currentFile,
      (this.from.currentRank + forward) as PositionRank
    );
    const pieceBetweenCheck = this.board.getPieceFromPosition(oneSpaceAhead);
    if (pieceBetweenCheck) return false;
    if (this.piece.onStartRank()) {
      return (rank === forward || rank === forward * 2) && file === 0;
    }
    return rank === forward && file === 0;
  }
  public isEnPassantMove(): boolean {
    if (!this.previousMove) return false;
    const to = this.to || this.potentialMove;
    if (!to) return false;
    const enPassantRank = this.piece.pieceColor === "white" ? 5 : 4;
    const currentRank = this.piece.currentPosition.currentRank;
    const enPassantFile = this.previousMove[1].currentFile;
    if (to.currentFile !== enPassantFile) return false;
    if (!(enPassantRank === currentRank)) return false;
    const { file, rank } = this.from.distanceFrom(to);
    const forward = this.piece.direction;
    const emptyPosition = this.board.getPieceFromPosition(to) === null;
    if (emptyPosition) {
      return Math.abs(file) === 1 && rank === forward;
    }
    return false;
  }
  private validateEnPassantMove(): boolean {
    if (!this.previousMove) return false;
    const previousFrom = this.previousMove[0];
    const previousTo = this.previousMove[1];
    const opposingStartRank = this.piece.pieceColor === "white" ? 7 : 2;
    const { file, rank } = previousFrom.distanceFrom(previousTo);
    if (!(Math.abs(rank) === 2 && file === 0)) return false;
    return previousFrom.currentRank === opposingStartRank;
  }
  possibleMoves(): Position[] {
    const moves: Position[] = [];
    const { currentFile, currentRank } = this.piece.currentPosition;
    const isWhitePiece = this.piece.pieceColor === "white";
    const direction = isWhitePiece ? 1 : -1;
    const startingRank = isWhitePiece ? 2 : 7;
    const rankAhead = (this.from.currentRank + 1 * direction) as PositionRank;
    const twoAhead = (this.from.currentRank + 2 * direction) as PositionRank;
    if (this.from.currentRank === startingRank) {
      this.potentialMove = new Position(currentFile, twoAhead);
      if (this.validateMove()) moves.push(this.potentialMove);
    }
    this.potentialMove = new Position(currentFile, rankAhead);
    if (this.validateMove()) moves.push(this.potentialMove);
    const leftFile = ChessBoard.fileFromDistance(currentFile, -1);
    const rightFile = ChessBoard.fileFromDistance(currentFile, 1);
    if (leftFile) {
      this.potentialMove = Position.from(leftFile, currentRank + 1 * direction);
      if (this.validateMove()) moves.push(this.potentialMove);
    }
    if (rightFile) {
      this.potentialMove = Position.from(
        rightFile,
        currentRank + 1 * direction
      );
      if (this.validateMove()) moves.push(this.potentialMove);
    }

    return moves;
  }
}

export class KnightMoveValidator extends MoveValidator<Knight> {
  validateMove(): boolean {
    if (!super.validateMove()) return false;
    return true;
  }
  possibleMoves(): Position[] {
    const moves = [] as Position[];
    const knightMoves = [
      [-2, -1],
      [-1, -2],
      [2, -1],
      [1, -2],
      [-2, 1],
      [-1, 2],
      [2, 1],
      [1, 2],
    ];
    for (const move of knightMoves) {
      const { currentFile, currentRank: rank } = this.piece.currentPosition;
      const fileToCheck = ChessBoard.fileFromDistance(currentFile, move[0]);
      const rankToCheck = (rank + move[1]) as PositionRank;
      if (!fileToCheck || rankToCheck < 1 || rankToCheck > 8) {
        continue;
      }
      this.potentialMove = new Position(fileToCheck, rankToCheck);
      if (this.validateMove()) moves.push(this.potentialMove);
    }
    return moves;
  }
}

export class DiagonalMoveValidator extends MoveValidator<Bishop | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const to = this.to || this.potentialMove;
    if (!to) return false;
    const distance = this.from.distanceFrom(to);
    const { rank, file } = distance;
    if (rank === 0 || file === 0) return false;
    const absoluteDifference = Math.abs(rank);
    const currentRank = this.from.currentRank;
    const rankDirection = rank < 0 ? -1 : 1;
    const fileDirection = file < 0 ? -1 : 1;
    for (let i = 1; i < absoluteDifference; i++) {
      const fileToCheck = ChessBoard.fileFromDistance(
        this.from.currentFile,
        i * fileDirection
      );
      if (!fileToCheck) return false;
      const rankToCheck = (currentRank + i * rankDirection) as PositionRank;
      const positionToCheck = new Position(fileToCheck, rankToCheck);
      if (this.board.getPieceFromPosition(positionToCheck)) return false;
    }
    return true;
  }
  public possibleMoves(): Position[] {
    const { currentFile, currentRank } = this.piece.currentPosition;
    const moves: Position[] = [];
    const directions: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    directions.forEach(([fileOffset, rankOffset]) => {
      for (let i = 1; i <= 8; i++) {
        const file = ChessBoard.fileFromDistance(currentFile, fileOffset * i);
        const newRank = (currentRank + rankOffset * i) as PositionRank;
        const rankInBounds = newRank >= 1 && newRank <= 8;
        if (file && rankInBounds) {
          this.potentialMove = new Position(file, newRank);
          if (this.validateMove()) moves.push(this.potentialMove);
        } else break;
      }
    });
    return moves;
  }
}

export class VerticalMoveValidator extends MoveValidator<Rook | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const to = this.to || this.potentialMove;
    if (!to) return false;
    const { rank, file } = this.from.distanceFrom(to);
    if (file !== 0) return false;
    const direction = rank > 0 ? 1 : -1;
    const currentFile = this.from.currentFile;
    const startRank = this.from.currentRank;
    for (let i = 1; i < Math.abs(rank); i += 1) {
      if (
        this.board.getPieceFromPosition(
          Position.from(currentFile, startRank + i * direction)
        )
      ) {
        return false;
      }
    }
    return true;
  }
  public possibleMoves(): Position[] {
    const moves = [] as Position[];
    for (let i = 1; i <= 8; i++) {
      this.potentialMove = new Position(
        this.from.currentFile,
        i as PositionRank
      );
      if (this.validateMove()) moves.push(this.potentialMove);
    }
    return moves;
  }
}

export class HorizontalMoveValidator extends MoveValidator<Rook | Queen> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    const to = this.to || this.potentialMove;
    if (!to) return false;
    const { file, rank } = this.from.distanceFrom(to);
    if (rank !== 0) return false;
    const direction = file > 0 ? 1 : -1;
    for (let i = 1; i < Math.abs(file); i++) {
      const fileToCheck = ChessBoard.fileFromDistance(
        this.from.currentFile,
        i * direction
      );
      if (!fileToCheck) return false;
      const current = Position.from(fileToCheck, this.from.currentRank);
      if (this.board.getPieceFromPosition(current)) {
        return false;
      }
    }
    return true;
  }
  public possibleMoves(): Position[] {
    const moves = [] as Position[];
    for (let i = 0; i < 8; i++) {
      const file = ChessBoard.fileFromDistance("A", i);
      if (!file) continue;
      this.potentialMove = new Position(file, this.from.currentRank);
      if (this.validateMove()) moves.push(this.potentialMove);
    }
    return moves;
  }
}

export class KingMoveValidator extends MoveValidator<King> {
  public validateMove(): boolean {
    if (!super.validateMove()) return false;
    return true;
  }
  public possibleMoves(): Position[] {
    const moves: Position[] = [];
    const { currentRank, currentFile } = this.piece.currentPosition;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const rank = (currentRank + i) as PositionRank;
        const file = ChessBoard.fileFromDistance(currentFile, j);
        if (!file || rank < 1 || rank > 8) continue;
        this.potentialMove = new Position(file, rank);
        if (this.validateMove()) moves.push(this.potentialMove);
      }
    }
    return moves;
  }
  public isCastlingMove() {
    if (!this.to) return false;
    const { file, rank } = this.from.distanceFrom(this.to);
    return Math.abs(file) === 2 && rank === 0;
  }
  public validateCastlingMove() {
    if (this.piece.hasMoved || this.piece.checked) return false;
    if (!this.to) return false;
    const { file } = this.from.distanceFrom(this.to);
    const rookFile = file === 2 ? "H" : "A";
    const direction = file > 0 ? 1 : -1;
    const rook = this.board.getPieceFromPosition(
      new Position(rookFile, this.from.currentRank)
    ) as Rook;
    if (!rook || rook.hasMoved) return false;
    let currentFile = this.piece.currentPosition.currentFile;
    while (currentFile !== rook.currentPosition.currentFile) {
      currentFile = ChessBoard.fileFromDistance(
        currentFile,
        1 * direction
      ) as PositionFile;
      const currentPosition = new Position(currentFile, this.from.currentRank);
      for (const piece of this.board.state.flat()) {
        if (piece === null || piece.pieceColor === this.piece.pieceColor)
          continue;
        if (piece.canMoveTo(currentPosition)) return false;
      }
    }
    return true;
  }
}

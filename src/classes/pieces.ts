import Position, { PositionFile, PositionRank } from "@/classes/position";
abstract class Piece {
  private position: Position;
  private color: "black" | "white";
  private captured: boolean;
  abstract type: string;
  constructor(
    color: "black" | "white",
    file: PositionFile,
    rank: PositionRank
  ) {
    this.color = color;
    this.captured = false;
    this.position = new Position(file, rank);
  }

  get currentPosition(): Position {
    return this.position;
  }
  get direction() {
    return this.color === "white" ? 1 : -1;
  }
  get pieceColor(): "black" | "white" {
    return this.color;
  }
  get isCaptured(): boolean {
    return this.captured;
  }

  set isCaptured(isCaptured: boolean) {
    this.captured = isCaptured;
  }
  set currentPosition(position: Position) {
    this.position = position;
  }

  abstract canMoveTo(position: Position): boolean;
}

export class Pawn extends Piece {
  type = "pawn";
  canMoveTo(position: Position) {
    const forward = this.direction;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    const unMoved = this.onStartRank();
    if (rank === forward && Math.abs(file) <= 1) return true;
    if (rank === forward * 2 && file === 0 && unMoved) return true;
    return false;
  }
  public onStartRank() {
    if (this.pieceColor === "white") {
      return this.currentPosition.currentRank === 2;
    } else {
      return this.currentPosition.currentRank === 7;
    }
  }
}

export class Rook extends Piece {
  type = "rook";
  canMoveTo(position: Position) {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return rank === 0 || file === 0;
  }
}

export class Knight extends Piece {
  type = "knight";
  canMoveTo(position: Position) {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    const absoluteRank = Math.abs(rank);
    const absoluteFile = Math.abs(file);
    return (
      (absoluteFile === 2 && absoluteRank === 1) ||
      (absoluteFile === 1 && absoluteRank === 2)
    );
  }
}

export class Bishop extends Piece {
  type = "bishop";
  canMoveTo(position: Position) {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return Math.abs(rank) === Math.abs(file);
  }
}

export class Queen extends Piece {
  type = "queen";
  canMoveTo(position: Position): boolean {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return rank === 0 || file === 0 || Math.abs(rank) === Math.abs(file);
  }
}

export class King extends Piece {
  type = "king";
  checked = false;
  canMoveTo(position: Position): boolean {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return Math.abs(rank) <= 1 && Math.abs(file) <= 1;
  }
}

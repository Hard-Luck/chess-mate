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

  get pieceColor(): "black" | "white" {
    return this.color;
  }

  get isCaptured(): boolean {
    return this.captured;
  }

  set isCaptured(isCaptured: boolean) {
    this.captured = isCaptured;
  }

  abstract canMoveTo(position: Position): boolean;

  moveTo(newPosition: Position) {
    if (this.canMoveTo(newPosition)) {
      this.position = newPosition;
    } else {
      throw new Error("Cannot move here");
    }
  }
}

export class Pawn extends Piece {
  type = "pawn";
  canMoveTo(position: Position) {
    const startRank = this.pieceColor === "white" ? 2 : 7;
    const forward = this.pieceColor === "white" ? 1 : -1;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    if (this.currentPosition.currentRank === startRank) {
      return (rank === forward || rank === forward * 2) && file === 0;
    }
    return rank === forward && file === 0;
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
    return Math.abs(rank) === Math.abs(file) || rank === 0 || file === 0;
  }
}

export class King extends Piece {
  type = "king";
  canMoveTo(position: Position): boolean {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return Math.abs(rank) <= 1 && Math.abs(file) <= 1;
  }
}

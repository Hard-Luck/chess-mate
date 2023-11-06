import Position, {
  Distance,
  PositionFile,
  PositionRank,
} from "@/classes/position";
import Game from "./game";
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

  abstract canMoveTo(position: Position, game?: Game): boolean;
  abstract availableMoves(game: Game): Position[];

  private getFileAsIndex(file: PositionFile) {
    const files = "ABCDEFGH";
    const fileAsNum = files.indexOf(file);
    return fileAsNum;
  }
  private fileFromIndex(index: number) {
    const files = "ABCDEFGH";
    return files[index];
  }
  checkFile(distance: number, game: Game) {
    const direction = distance > 0 ? 1 : -1;
    const file = this.currentPosition.currentFile;
    const startRank = this.currentPosition.currentRank;
    for (let i = 1; i < Math.abs(distance); i += 1) {
      if (
        game.getPieceFromPosition(
          Position.from(file, startRank + i * direction)
        )
      ) {
        return false;
      }
    }
    return true;
  }
  checkRank(distance: number, game: Game) {
    const direction = distance > 0 ? 1 : -1;
    const rank = this.currentPosition.currentRank;
    const file = this.currentPosition.currentFile;

    for (let i = 1; i < Math.abs(distance); i += 1) {
      const fileAsNum = this.getFileAsIndex(file);
      const fileToCheck = this.fileFromIndex(fileAsNum + i * direction);
      if (game.getPieceFromPosition(Position.from(fileToCheck, rank))) {
        return false;
      }
    }
    return true;
  }
  checkDiagonal(distance: Distance, game: Game) {
    const { rank, file } = distance;
    const absoluteDifference = Math.abs(rank);
    const fileIndex = this.getFileAsIndex(this.currentPosition.currentFile);
    const rankIndex = this.currentPosition.currentRank;
    const rankUnits = rank / absoluteDifference;
    const fileUnits = file / absoluteDifference;
    for (let i = 1; i < absoluteDifference; i++) {
      const fileToCheck = this.fileFromIndex(fileIndex + i * fileUnits);
      const rankToCheck = rankIndex + i * rankUnits;
      const positionToCheck = Position.from(fileToCheck, rankToCheck);
      if (game.getPieceFromPosition(positionToCheck)) {
        return false;
      }
    }
    return true;
  }
  moveTo(newPosition: Position, game?: Game) {
    if (this.canMoveTo(newPosition, game)) {
      this.position = newPosition;
    } else {
      throw new Error("Cannot move here");
    }
  }
}

export class Pawn extends Piece {
  type = "pawn";
  canMoveTo(position: Position, game?: Game) {
    const startRank = this.pieceColor === "white" ? 2 : 7;
    const forward = this.pieceColor === "white" ? 1 : -1;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    const attemptedCapture = Math.abs(file) === 1 && rank === forward;
    if (attemptedCapture) {
      if (!game) throw Error("No board passed");
      const pieceOnCapturingSquare = game.getPieceFromPosition(position);
      if (
        pieceOnCapturingSquare &&
        pieceOnCapturingSquare?.pieceColor !== this.pieceColor
      )
        return true;
      return false;
    }
    if (Math.abs(rank) === 2) {
      const oneSpaceAhead = new Position(
        position.currentFile,
        (position.currentRank - forward) as PositionRank
      );
      const pieceBetweenCheck = game?.getPieceFromPosition(oneSpaceAhead);
      if (pieceBetweenCheck) return false;
    }
    if (game && game?.getPieceFromPosition(position) !== null) return false;
    if (this.currentPosition.currentRank === startRank) {
      return (rank === forward || rank === forward * 2) && file === 0;
    }
    return rank === forward && file === 0;
  }
  availableMoves(game: Game): Position[] {
    const moves: Position[] = [];
    const { currentFile, currentRank } = this.currentPosition;
    const startingRank = this.pieceColor === "white" ? 2 : 7;
    const rankAhead = (this.currentPosition.currentRank + 1) as PositionRank;
    if (this.currentPosition.currentRank === startingRank) {
      for (let i = 1; i < 3; i++) {
        const move = new Position(
          currentFile,
          (currentRank + i) as PositionRank
        );
        if (this.canMoveTo(move, game)) {
          moves.push(move);
        }
      }
    } else {
      const move = new Position(currentFile, rankAhead);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    const currentFileAsIndex = Position.fileToNumber(currentFile);
    const leftFile = currentFileAsIndex - 1;
    const rightFile = currentFileAsIndex + 1;
    if (leftFile >= 1) {
      const leftFilePosition = Position.from(
        Position.numberToFile(leftFile),
        currentRank + 1
      );
      if (this.canMoveTo(leftFilePosition, game)) moves.push(leftFilePosition);
    }
    if (rightFile < 8) {
      const rightFilePosition = Position.from(
        Position.numberToFile(rightFile),
        currentRank + 1
      );
      if (this.canMoveTo(rightFilePosition, game))
        moves.push(rightFilePosition);
    }
    return moves;
  }
}

export class Rook extends Piece {
  type = "rook";
  canMoveTo(position: Position, game: Game) {
    if (game.getPieceFromPosition(position)?.pieceColor === this.pieceColor)
      return false;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    if (file === 0) {
      const check = this.checkFile(rank, game);
      return check;
    }
    if (rank === 0) {
      return this.checkRank(file, game);
    }
    return false;
  }
  availableMoves(game: Game): Position[] {
    const moves: Position[] = [];
    const { currentFile, currentRank } = this.currentPosition;
    for (let i = 1; i < currentRank; i++) {
      const move = new Position(currentFile, i as PositionRank);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    for (let i = currentRank + 1; i < 9; i++) {
      const move = new Position(currentFile, i as PositionRank);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    const currentFileIndex = Position.fileToNumber(currentFile);
    for (let i = 1; i < currentFileIndex; i++) {
      const move = new Position(Position.numberToFile(i), currentRank);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    for (let i = currentFileIndex + 1; i < 9; i++) {
      const move = new Position(Position.numberToFile(i), currentRank);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    return moves;
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
  availableMoves(game: Game): Position[] {
    if (game) return [] as Position[];
    return [] as Position[];
  }
}

export class Bishop extends Piece {
  type = "bishop";
  canMoveTo(position: Position, game: Game) {
    const distance = this.currentPosition.distanceFrom(position);
    if (!(Math.abs(distance.rank) === Math.abs(distance.file))) return false;
    return this.checkDiagonal(distance, game);
  }
  availableMoves(game: Game): Position[] {
    if (game) return [] as Position[];
    return [] as Position[];
  }
}

export class Queen extends Piece {
  type = "queen";
  canMoveTo(position: Position, game: Game): boolean {
    const distance = this.currentPosition.distanceFrom(position);
    if (Math.abs(distance.rank) === Math.abs(distance.file)) {
      return this.checkDiagonal(distance, game);
    }
    if (distance.file === 0) {
      return this.checkFile(distance.rank, game);
    }
    if (distance.rank === 0) {
      return this.checkRank(distance.file, game);
    }
    return false;
  }
  availableMoves(game: Game): Position[] {
    if (game) return [] as Position[];
    return [] as Position[];
  }
}

export class King extends Piece {
  type = "king";
  canMoveTo(position: Position): boolean {
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return Math.abs(rank) <= 1 && Math.abs(file) <= 1;
  }
  availableMoves(game: Game): Position[] {
    if (game) return [] as Position[];
    return [] as Position[];
  }
}

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
  availableStraightMoves(game: Game) {
    const { currentFile, currentRank } = this.currentPosition;
    const moves: Position[] = [];
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
  availableDiagonals(game: Game): Position[] {
    const { currentFile, currentRank } = this.currentPosition;
    const fileAsNum = Position.fileToNumber(currentFile);
    const moves: Position[] = [];
    const directions: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    directions.forEach(([fileOffset, rankOffset]) => {
      for (let i = 1; i <= 8; i++) {
        const newFileAsNum = fileAsNum + fileOffset * i;
        const newRank = (currentRank + rankOffset * i) as PositionRank;
        const fileInBounds = newFileAsNum >= 1 && newFileAsNum <= 8;
        const rankInBounds = newRank >= 1 && newRank <= 8;
        if (fileInBounds && rankInBounds) {
          const file = Position.numberToFile(newFileAsNum);
          const newPosition = new Position(file, newRank);
          if (this.canMoveTo(newPosition, game)) moves.push(newPosition);
        } else break;
      }
    });
    return moves;
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
  public checkEnPassant(game: Game) {
    const rankForEnPassant = this.pieceColor === "white" ? 5 : 4;
    if (this.currentPosition.currentRank !== rankForEnPassant) return false;
    const lastMove = game.moves.previousMove;
    if (!lastMove) return false;
    const distance = lastMove[0].distanceFrom(lastMove[1]);
    const piece = game.getPieceFromPosition(lastMove[1]);
    if (
      piece?.type === "pawn" &&
      piece?.pieceColor !== this.pieceColor &&
      Math.abs(distance.rank) === 2
    ) {
      return true;
    }
    return false;
  }
  type = "pawn";
  canMoveTo(position: Position, game?: Game) {
    const forward = this.pieceColor === "white" ? 1 : -1;
    const startRank = this.pieceColor === "white" ? 2 : 7;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    const attemptedCapture = Math.abs(file) === 1 && rank === forward;
    if (
      game &&
      this.checkEnPassant(game) &&
      position.currentFile !== this.currentPosition.currentFile
    ) {
      const lastMove = game.moves.previousMove;
      if (!lastMove) return false;
      const lastMoveFile = lastMove[1].currentFile;
      const lastMoveRank = lastMove[1].currentRank;
      if (position.currentFile !== lastMoveFile) return false;
      if (position.currentRank - forward !== lastMoveRank) return false;
      return true;
    }
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
    const isWhitePiece = this.pieceColor === "white";
    const direction = isWhitePiece ? 1 : -1;
    const startingRank = isWhitePiece ? 2 : 7;
    const rankAhead = (this.currentPosition.currentRank +
      1 * direction) as PositionRank;
    const twoAhead = (this.currentPosition.currentRank +
      2 * direction) as PositionRank;
    if (this.currentPosition.currentRank === startingRank) {
      const move = new Position(currentFile, twoAhead);
      if (this.canMoveTo(move, game)) moves.push(move);
    }
    const move = new Position(currentFile, rankAhead);
    if (this.canMoveTo(move, game)) moves.push(move);
    const currentFileAsIndex = Position.fileToNumber(currentFile);
    const leftFile = currentFileAsIndex - 1;
    const rightFile = currentFileAsIndex + 1;
    if (leftFile >= 1) {
      const leftFilePosition = Position.from(
        Position.numberToFile(leftFile),
        currentRank + 1 * direction
      );
      if (this.canMoveTo(leftFilePosition, game)) moves.push(leftFilePosition);
    }
    if (rightFile < 8) {
      const rightFilePosition = Position.from(
        Position.numberToFile(rightFile),
        currentRank + 1 * direction
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
    return this.availableStraightMoves(game);
  }
}

export class Knight extends Piece {
  type = "knight";
  canMoveTo(position: Position, game: Game) {
    const pieceCheck = game.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    const absoluteRank = Math.abs(rank);
    const absoluteFile = Math.abs(file);
    return (
      (absoluteFile === 2 && absoluteRank === 1) ||
      (absoluteFile === 1 && absoluteRank === 2)
    );
  }
  availableMoves(game: Game): Position[] {
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
      const { currentFile, currentRank: rank } = this.currentPosition;
      const fileAsNum = Position.fileToNumber(currentFile);
      const fileToCheck = fileAsNum + move[0];
      const rankToCheck = (rank + move[1]) as PositionRank;
      if (
        fileToCheck > 8 ||
        fileToCheck < 1 ||
        rankToCheck < 1 ||
        rankToCheck > 8
      ) {
        continue;
      }
      const file = Position.numberToFile(fileToCheck);
      const position = new Position(file, rankToCheck);
      if (this.canMoveTo(position, game)) moves.push(position);
    }
    return moves;
  }
}

export class Bishop extends Piece {
  type = "bishop";
  canMoveTo(position: Position, game: Game) {
    const pieceCheck = game.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
    const distance = this.currentPosition.distanceFrom(position);
    if (!(Math.abs(distance.rank) === Math.abs(distance.file))) return false;
    return this.checkDiagonal(distance, game);
  }
  availableMoves(game: Game): Position[] {
    return this.availableDiagonals(game);
  }
}

export class Queen extends Piece {
  type = "queen";
  canMoveTo(position: Position, game: Game): boolean {
    const pieceCheck = game.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
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
    const diagonalMoves = this.availableDiagonals(game);
    const straightMoves = this.availableStraightMoves(game);
    const moves = [...diagonalMoves, ...straightMoves];
    return moves;
  }
}

export class King extends Piece {
  type = "king";
  checked = false;
  canMoveTo(position: Position, game: Game): boolean {
    const pieceCheck = game.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    return Math.abs(rank) <= 1 && Math.abs(file) <= 1;
  }

  availableMoves(game: Game): Position[] {
    const moves: Position[] = [];
    const { currentRank, currentFile } = this.currentPosition;
    const fileAsNum = Position.fileToNumber(currentFile);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const rank = (currentRank + j) as PositionRank;
        const newFileAsNum = fileAsNum + i;
        if (newFileAsNum < 1 || newFileAsNum > 8 || rank < 1 || rank > 8)
          continue;
        const file = Position.numberToFile(newFileAsNum);
        if (this.canMoveTo(new Position(file, rank), game))
          moves.push(new Position(file, rank));
      }
    }
    return moves;
  }
}

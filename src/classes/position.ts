export type PositionFile = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type PositionRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Distance = { file: number; rank: number };
class Position {
  constructor(private file: PositionFile, private rank: PositionRank) {
    this.file = file;
    this.rank = rank;
  }
  static fileToNumber(file: PositionFile) {
    return "ABCDEFGH".indexOf(file) + 1;
  }
  static numberToFile(number: number) {
    if (number < 1 || number > 8) throw new Error("bad number");
    return "ABCDEFGH"[number - 1];
  }
  public distanceFrom(position: Position): Distance {
    const currentFileAsNumber = Position.fileToNumber(this.file);
    const otherFileAsNumber = Position.fileToNumber(position.file);
    const fileDistance = otherFileAsNumber - currentFileAsNumber;
    const rankDistance = position.rank - this.rank;
    return { file: fileDistance, rank: rankDistance };
  }
  get currentFile() {
    return this.file;
  }
  get currentRank() {
    return this.rank;
  }
  static from(file: string, rank: number | string) {
    if ("ABCDEFGH".indexOf(file) === -1) throw new Error("bad file");
    if (typeof rank === "string") rank = +rank;
    if (rank < 1 || rank > 8) throw new Error("bad rank");
    return new Position(file as PositionFile, rank as PositionRank);
  }
}

export default Position;

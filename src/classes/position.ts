export type PositionFile = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type PositionRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

class Position {
  constructor(private file: PositionFile, private rank: PositionRank) {
    this.file = file;
    this.rank = rank;
  }
  private fileToNumber(file: PositionFile) {
    return "ABCDEFGH".indexOf(file) + 1;
  }

  public distanceFrom(position: Position) {
    const currentFileAsNumber = this.fileToNumber(this.file);
    const otherFileAsNumber = this.fileToNumber(position.file);
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

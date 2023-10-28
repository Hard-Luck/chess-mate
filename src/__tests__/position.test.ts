import Position from "@/position";

describe("distanceFrom", () => {
  it("should return correct distance on same file", () => {
    const position1 = new Position("A", 1);
    const position2 = new Position("A", 2);
    const distance1 = position1.distanceFrom(position2);
    const distance2 = position2.distanceFrom(position1);
    expect(distance1).toEqual({ file: 0, rank: 1 });
    expect(distance2).toEqual({ file: 0, rank: -1 });
  });
  it("should return correct distance on same rank", () => {
    const position1 = new Position("A", 1);
    const position2 = new Position("B", 1);
    const distance1 = position1.distanceFrom(position2);
    const distance2 = position2.distanceFrom(position1);
    expect(distance1).toEqual({ file: 1, rank: 0 });
    expect(distance2).toEqual({ file: -1, rank: 0 });
  });
  it("should return correct distances for different rank and files", () => {
    const position1 = new Position("A", 1);
    const position2 = new Position("B", 3);
    const distance1 = position1.distanceFrom(position2);
    const distance2 = position2.distanceFrom(position1);
    expect(distance1).toEqual({ file: 1, rank: 2 });
    expect(distance2).toEqual({ file: -1, rank: -2 });
  });
});

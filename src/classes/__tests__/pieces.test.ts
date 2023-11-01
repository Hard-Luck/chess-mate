import { Bishop, King, Knight, Pawn, Queen, Rook } from "@/classes/pieces";
import Position from "@/classes/position";

describe("Pawn", () => {
  describe("canMoveTo", () => {
    it("should move forward 1 step from starting position", () => {
      const pawn = new Pawn("white", "A", 2);
      const move = new Position("A", 3);
      expect(pawn.canMoveTo(move)).toBe(true);
    });
    it("should move forward 2 steps from starting position", () => {
      const pawn = new Pawn("white", "A", 2);
      const move = new Position("A", 4);
      expect(pawn.canMoveTo(move)).toBe(true);
    });
    it("should not move forward more than 2 steps from starting position", () => {
      const pawn = new Pawn("white", "A", 2);
      const move = new Position("A", 5);
      expect(pawn.canMoveTo(move)).toBe(false);
    });
    it("should not move backward", () => {
      const pawn = new Pawn("white", "A", 2);
      const move = new Position("A", 1);
      expect(pawn.canMoveTo(move)).toBe(false);
    });
    it("should not move more than 1 step if not on starting step", () => {
      const pawn = new Pawn("white", "A", 3);
      const move = new Position("A", 5);
      expect(pawn.canMoveTo(move)).toBe(false);
    });
  });
});

describe("Rook", () => {
  describe("canMoveTo", () => {
    it("should move forward 1 step", () => {
      const rook = new Rook("white", "A", 1);
      const move = new Position("A", 2);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move backward 1 step", () => {
      const rook = new Rook("white", "A", 2);
      const move = new Position("A", 1);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move right 1 step", () => {
      const rook = new Rook("white", "A", 1);
      const move = new Position("B", 1);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move left 1 step", () => {
      const rook = new Rook("white", "B", 1);
      const move = new Position("A", 1);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step right", () => {
      const rook = new Rook("white", "A", 4);
      const move = new Position("B", 4);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step left", () => {
      const rook = new Rook("white", "D", 4);
      const move = new Position("A", 4);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step up", () => {
      const rook = new Rook("white", "D", 4);
      const move = new Position("D", 8);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step down", () => {
      const rook = new Rook("white", "D", 4);
      const move = new Position("D", 1);
      expect(rook.canMoveTo(move)).toBe(true);
    });
    it("shouldn't move diagonally", () => {
      const rook = new Rook("white", "D", 4);
      const move = new Position("E", 5);
      expect(rook.canMoveTo(move)).toBe(false);
    });
  });
});

describe("Knight", () => {
  describe("canMoveTo", () => {
    it("should move 2 steps up and 1 step right", () => {
      const knight = new Knight("white", "B", 1);
      const move = new Position("C", 3);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps up and 1 step left", () => {
      const knight = new Knight("white", "B", 1);
      const move = new Position("A", 3);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps down and 1 step right", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("D", 1);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps down and 1 step left", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("B", 1);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps right and 1 step up", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("E", 4);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps left and 1 step up", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("A", 4);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("should move 2 steps left and 1 step down", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("A", 2);
      expect(knight.canMoveTo(move)).toBe(true);
    });
    it("shouldn't move otherwise", () => {
      const knight = new Knight("white", "C", 3);
      const move = new Position("B", 2);
      expect(knight.canMoveTo(move)).toBe(false);

      const secondTestKnight = new Knight("white", "F", 3);
      const secondMove = new Position("A", 1);
      expect(secondTestKnight.canMoveTo(secondMove)).toBe(false);
    });
  });
});

describe("Bishop", () => {
  describe("canMoveTo", () => {
    it("should move diagonally forward and right", () => {
      const bishop = new Bishop("white", "C", 1);
      const move = new Position("E", 3);
      expect(bishop.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally forward and left", () => {
      const bishop = new Bishop("white", "C", 1);
      const move = new Position("A", 3);
      expect(bishop.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally backward and right", () => {
      const bishop = new Bishop("white", "C", 5);
      const move = new Position("E", 3);
      expect(bishop.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally backward and left", () => {
      const bishop = new Bishop("white", "C", 5);
      const move = new Position("A", 7);
      expect(bishop.canMoveTo(move)).toBe(true);
    });
    it("shouldn't move otherwise", () => {
      const testBishop = new Bishop("white", "C", 5);
      const move = new Position("B", 3);
      expect(testBishop.canMoveTo(move)).toBe(false);

      const secondTestBishop = new Bishop("white", "F", 3);
      const secondMove = new Position("A", 1);
      expect(secondTestBishop.canMoveTo(secondMove)).toBe(false);

      const thirdTestBishop = new Bishop("white", "F", 3);
      const thirdMove = new Position("A", 2);
      expect(thirdTestBishop.canMoveTo(thirdMove)).toBe(false);

      const fourthTestBishop = new Bishop("white", "F", 3);
      const fourthMove = new Position("A", 3);
      expect(fourthTestBishop.canMoveTo(fourthMove)).toBe(false);

      const fifthTestBishop = new Bishop("white", "F", 3);
      const fifthMove = new Position("A", 4);
      expect(fifthTestBishop.canMoveTo(fifthMove)).toBe(false);
    });
  });
});

describe("Queen", () => {
  describe("canMoveTo", () => {
    it("should move forward 1 step", () => {
      const queen = new Queen("white", "A", 1);
      const move = new Position("A", 2);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move backward 1 step", () => {
      const queen = new Queen("white", "A", 2);
      const move = new Position("A", 1);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move right 1 step", () => {
      const queen = new Queen("white", "A", 1);
      const move = new Position("B", 1);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move left 1 step", () => {
      const queen = new Queen("white", "B", 1);
      const move = new Position("A", 1);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step right", () => {
      const queen = new Queen("white", "A", 4);
      const move = new Position("B", 4);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step left", () => {
      const queen = new Queen("white", "D", 4);
      const move = new Position("A", 4);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step up", () => {
      const queen = new Queen("white", "D", 4);
      const move = new Position("D", 8);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move more than 1 step down", () => {
      const queen = new Queen("white", "D", 4);
      const move = new Position("D", 1);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally forward and right", () => {
      const queen = new Queen("white", "C", 1);
      const move = new Position("E", 3);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally forward and left", () => {
      const queen = new Queen("white", "C", 1);
      const move = new Position("A", 3);
      1;
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally backward and right", () => {
      const queen = new Queen("white", "C", 5);
      const move = new Position("E", 3);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("should move diagonally backward and left", () => {
      const queen = new Queen("white", "C", 5);
      const move = new Position("A", 7);
      expect(queen.canMoveTo(move)).toBe(true);
    });
    it("shouldn't move otherwise", () => {
      const testQueen = new Queen("white", "C", 5);
      const move = new Position("B", 3);
      expect(testQueen.canMoveTo(move)).toBe(false);

      const secondTestQueen = new Queen("white", "F", 3);
      const secondMove = new Position("A", 1);
      expect(secondTestQueen.canMoveTo(secondMove)).toBe(false);

      const thirdTestQueen = new Queen("white", "F", 3);
      const thirdMove = new Position("A", 2);
      expect(thirdTestQueen.canMoveTo(thirdMove)).toBe(false);

      const fourthTestQueen = new Queen("white", "F", 7);
      const fourthMove = new Position("A", 3);
      expect(fourthTestQueen.canMoveTo(fourthMove)).toBe(false);

      const fifthTestQueen = new Queen("white", "F", 3);
      const fifthMove = new Position("A", 4);
      expect(fifthTestQueen.canMoveTo(fifthMove)).toBe(false);
    });
  });
});

describe("King", () => {
  it("should move 1 step forward", () => {
    const king = new King("white", "E", 4);
    const move = new Position("E", 5);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step backward", () => {
    const king = new King("white", "E", 4);
    const move = new Position("E", 3);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step right", () => {
    const king = new King("white", "E", 4);
    const move = new Position("F", 4);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step left", () => {
    const king = new King("white", "E", 4);
    const move = new Position("D", 4);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step  diagonally up-right ", () => {
    const king = new King("white", "E", 4);
    const move = new Position("F", 5);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step diagonally up-left", () => {
    const king = new King("white", "E", 4);
    const move = new Position("D", 5);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step diagonally down-right", () => {
    const king = new King("white", "E", 4);
    const move = new Position("F", 3);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("should move 1 step diagonally down-left", () => {
    const king = new King("white", "E", 4);
    const move = new Position("D", 3);
    expect(king.canMoveTo(move)).toBe(true);
  });
  it("shouldn't move otherwise", () => {
    const king = new King("white", "E", 4);
    const move = new Position("E", 6);
    expect(king.canMoveTo(move)).toBe(false);

    const secondKing = new King("white", "E", 4);
    const secondMove = new Position("G", 4);
    expect(secondKing.canMoveTo(secondMove)).toBe(false);

    const thirdKing = new King("white", "E", 4);
    const thirdMove = new Position("C", 3);
    expect(thirdKing.canMoveTo(thirdMove)).toBe(false);
  });
});

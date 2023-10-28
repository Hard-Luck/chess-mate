import { Knight, Pawn, Rook } from "@/pieces";
import Position from "@/position";

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

describe("rook", () => {
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

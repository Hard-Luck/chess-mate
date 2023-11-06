import { Bishop, King, Knight, Pawn, Queen, Rook } from "@/classes/pieces";
import Position from "@/classes/position";
import Game from "../game";

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
  describe("availableMoves", () => {
    it("should return available moves for unmoved white pawn", () => {
      const game = new Game();
      const pawn = new Pawn("white", "A", 2);
      const moves = pawn.availableMoves(game);
      const expectedMoves = [new Position("A", 3), new Position("A", 4)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
    it("should return available moves for a black pawn ", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 4));
      const pawn = new Pawn("black", "A", 7);
      const moves = pawn.availableMoves(game);
      const expectedMoves = [new Position("A", 6), new Position("A", 5)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
    it("should return available moves when a pawn can capture", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 4));
      game.makeMove(new Position("B", 7), new Position("B", 5));
      const pawn = new Pawn("white", "A", 4);
      const moves = pawn.availableMoves(game);
      const expectedMoves = [new Position("A", 5), new Position("B", 5)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
  });
});

describe("Rook", () => {
  describe("canMoveTo", () => {
    it("should move forward 1 step", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      const rook = new Rook("white", "A", 1);
      const move = new Position("A", 2);
      expect(rook.canMoveTo(move, game)).toBe(true);
    });
    it("should move backward 1 step", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      game.makeMove(new Position("A", 1), new Position("A", 2));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      const rook = new Rook("white", "A", 2);
      const move = new Position("A", 1);
      expect(rook.canMoveTo(move, game)).toBe(true);
    });
    it("should move right 1 step", () => {
      const game = new Game();
      game.makeMove(new Position("B", 1), new Position("A", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      const rook = new Rook("white", "A", 1);
      const move = new Position("B", 1);
      expect(rook.canMoveTo(move, game)).toBe(true);
    });
    it("should move left 1 step", () => {
      const game = new Game();
      game.makeMove(new Position("B", 1), new Position("A", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      game.makeMove(new Position("A", 1), new Position("B", 1));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      const rook = new Rook("white", "B", 1);
      const move = new Position("A", 1);
      expect(rook.canMoveTo(move, game)).toBe(true);
    });
    it("should move more than 1 step", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 4));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      game.makeMove(new Position("A", 1), new Position("A", 3));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      const rook = new Rook("white", "A", 3);
      const move = new Position("D", 3);
      expect(rook.canMoveTo(move, game)).toBe(true);
    });
    it("shouldn't move diagonally", () => {
      const game = new Game();
      const rook = new Rook("white", "D", 4);
      const move = new Position("E", 5);
      expect(rook.canMoveTo(move, game)).toBe(false);
    });
  });
  describe("availableMoves", () => {
    it("should return available moves for rook", () => {
      const game = new Game();
      game.makeMove(new Position("A", 2), new Position("A", 4));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      game.makeMove(new Position("A", 4), new Position("A", 5));
      game.makeMove(new Position("G", 7), new Position("G", 6));
      game.makeMove(new Position("A", 1), new Position("A", 4));
      game.makeMove(new Position("F", 7), new Position("F", 6));
      game.makeMove(new Position("A", 4), new Position("D", 4));
      game.makeMove(new Position("A", 7), new Position("A", 6));
      const rook = new Rook("white", "D", 4);
      const moves = rook.availableMoves(game);
      const expectedMoves = [
        new Position("D", 3),
        new Position("D", 5),
        new Position("D", 6),
        new Position("D", 7),
        new Position("A", 4),
        new Position("B", 4),
        new Position("C", 4),
        new Position("E", 4),
        new Position("F", 4),
        new Position("G", 4),
        new Position("H", 4),
      ];
      expect(moves.length).toBe(11);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
  });
  it("should return available moves when a rook can capture", () => {
    const game = new Game();
    game.makeMove(new Position("A", 2), new Position("A", 4));
  });
});

describe("Knight", () => {
  describe("canMoveTo", () => {
    it("should move 2 steps up and 1 step right", () => {
      const game = new Game();
      const knight = new Knight("white", "B", 1);
      const move = new Position("C", 3);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps up and 1 step left", () => {
      const game = new Game();
      const knight = new Knight("white", "B", 1);
      const move = new Position("A", 3);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps down and 1 step right", () => {
      const game = new Game();
      game.makeMove(new Position("B", 1), new Position("A", 3));
      game.makeMove(new Position("B", 7), new Position("B", 6));
      const knight = new Knight("white", "A", 3);
      const move = new Position("B", 1);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps down and one step left", () => {
      const game = new Game();
      game.makeMove(new Position("B", 1), new Position("C", 3));
      game.makeMove(new Position("B", 7), new Position("B", 6));
      const knight = new Knight("white", "C", 3);
      const move = new Position("B", 1);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps right and 1 step up", () => {
      const game = new Game();
      game.makeMove(new Position("D", 2), new Position("D", 3));
      game.makeMove(new Position("D", 7), new Position("D", 6));
      const knight = new Knight("white", "B", 1);
      const move = new Position("D", 2);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps left and 1 step up", () => {
      const game = new Game();
      game.makeMove(new Position("E", 2), new Position("E", 3));
      game.makeMove(new Position("E", 7), new Position("E", 6));
      const knight = new Knight("white", "G", 1);
      const move = new Position("E", 2);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("should move 2 steps left and 1 step down", () => {
      const game = new Game();
      game.makeMove(new Position("D", 2), new Position("D", 3));
      game.makeMove(new Position("D", 7), new Position("D", 6));
      game.makeMove(new Position("B", 1), new Position("D", 2));
      game.makeMove(new Position("D", 6), new Position("D", 5));
      const knight = new Knight("white", "D", 2);
      const move = new Position("B", 1);
      expect(knight.canMoveTo(move, game)).toBe(true);
    });
    it("shouldn't move otherwise", () => {
      const game = new Game();
      const knight = new Knight("white", "C", 3);
      const move = new Position("B", 2);
      expect(knight.canMoveTo(move, game)).toBe(false);

      const secondTestKnight = new Knight("white", "F", 3);
      const secondMove = new Position("A", 1);
      expect(secondTestKnight.canMoveTo(secondMove, game)).toBe(false);
    });
  });
});

describe("Bishop", () => {
  describe("canMoveTo", () => {
    it("should move diagonally forward and right and then back", () => {
      const game = new Game();
      game.makeMove(new Position("D", 2), new Position("D", 4));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      let bishop = new Bishop("white", "C", 1);
      let move = new Position("E", 3);
      expect(bishop.canMoveTo(move, game)).toBe(true);
      game.makeMove(new Position("C", 1), new Position("E", 3));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      bishop = new Bishop("white", "E", 3);
      move = new Position("C", 1);
      expect(bishop.canMoveTo(move, game)).toBe(true);
    });
    it("should move diagonally forward and left then back ", () => {
      const game = new Game();
      game.makeMove(new Position("B", 2), new Position("B", 4));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      let bishop = new Bishop("white", "C", 1);
      let move = new Position("A", 3);
      expect(bishop.canMoveTo(move, game)).toBe(true);
      game.makeMove(new Position("C", 1), new Position("A", 3));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      bishop = new Bishop("white", "A", 3);
      move = new Position("C", 1);
      expect(bishop.canMoveTo(move, game)).toBe(true);
    });
  });
  describe("availableMoves", () => {
    it("should return available moves", () => {
      const game = new Game();
      game.makeMove(new Position("D", 2), new Position("D", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      game.makeMove(new Position("C", 1), new Position("E", 3));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      const bishop = new Bishop("white", "E", 3);
      const moves = bishop.availableMoves(game);
      const expectedMoves = [
        new Position("C", 1),
        new Position("D", 2),
        new Position("F", 4),
        new Position("G", 5),
        new Position("H", 6),
        new Position("D", 4),
        new Position("C", 5),
        new Position("B", 6),
        new Position("A", 7),
      ];
      expect(moves.length).toBe(9);
      moves.forEach((move) => {
        expect(expectedMoves).toContainEqual(move);
      });
    });
  });
});

describe("Queen", () => {
  describe("canMoveTo", () => {
    it("should be able to move in all directions", () => {
      const game = new Game();
      game.makeMove(new Position("E", 2), new Position("E", 3));
      game.makeMove(new Position("H", 7), new Position("H", 6));
      // Diagonal
      let queen = new Queen("white", "D", 1);
      let move = new Position("G", 4);
      expect(queen.canMoveTo(move, game)).toBe(true);
      game.makeMove(new Position("D", 1), new Position("G", 4));
      game.makeMove(new Position("H", 6), new Position("H", 5));
      // Left
      queen = new Queen("white", "G", 4);
      move = new Position("A", 4);
      expect(queen.canMoveTo(move, game)).toBe(true);
      game.makeMove(new Position("G", 4), new Position("A", 4));
      game.makeMove(new Position("H", 5), new Position("H", 4));
    });
  });
  describe("availableMoves", () => {
    const game = new Game();
    game.makeMove(new Position("E", 2), new Position("E", 3));
    game.makeMove(new Position("A", 7), new Position("A", 6));
    game.makeMove(new Position("D", 1), new Position("G", 4));
    game.makeMove(new Position("G", 7), new Position("G", 6));
    const moves = new Queen("white", "G", 4).availableMoves(game);
    const expectedMoves = [
      { file: "A", rank: 4 },
      { file: "B", rank: 4 },
      { file: "C", rank: 4 },
      { file: "D", rank: 1 },
      { file: "D", rank: 4 },
      { file: "D", rank: 7 },
      { file: "E", rank: 2 },
      { file: "E", rank: 4 },
      { file: "E", rank: 6 },
      { file: "F", rank: 3 },
      { file: "F", rank: 4 },
      { file: "F", rank: 5 },
      { file: "G", rank: 3 },
      { file: "G", rank: 5 },
      { file: "G", rank: 6 },
      { file: "H", rank: 3 },
      { file: "H", rank: 4 },
      { file: "H", rank: 5 },
    ];
    expect(moves.length).toBe(expectedMoves.length);
    moves.forEach((move) => {
      expect(expectedMoves).toContainEqual(move);
    });
  });
});

describe("King", () => {
  it("should move 1 step forward", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("E", 5);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step backward", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("E", 3);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step right", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("F", 4);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step left", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("D", 4);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step  diagonally up-right ", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("F", 5);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step diagonally up-left", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("D", 5);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step diagonally down-right", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("F", 3);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("should move 1 step diagonally down-left", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("D", 3);
    expect(king.canMoveTo(move, game)).toBe(true);
  });
  it("shouldn't move otherwise", () => {
    const game = new Game();
    const king = new King("white", "E", 4);
    const move = new Position("E", 6);
    expect(king.canMoveTo(move, game)).toBe(false);

    const secondKing = new King("white", "E", 4);
    const secondMove = new Position("G", 4);
    expect(secondKing.canMoveTo(secondMove, game)).toBe(false);

    const thirdKing = new King("white", "E", 4);
    const thirdMove = new Position("C", 3);
    expect(thirdKing.canMoveTo(thirdMove, game)).toBe(false);
  });
});

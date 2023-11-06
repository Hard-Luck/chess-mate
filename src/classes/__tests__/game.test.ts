import Game from "@/classes/game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "@/classes/pieces";
import Position from "../position";

const startingPositions = [
  [
    new Rook("white", "A", 1),
    new Knight("white", "B", 1),
    new Bishop("white", "C", 1),
    new Queen("white", "D", 1),
    new King("white", "E", 1),
    new Bishop("white", "F", 1),
    new Knight("white", "G", 1),
    new Rook("white", "H", 1),
  ],

  [
    new Pawn("white", "A", 2),
    new Pawn("white", "B", 2),
    new Pawn("white", "C", 2),
    new Pawn("white", "D", 2),
    new Pawn("white", "E", 2),
    new Pawn("white", "F", 2),
    new Pawn("white", "G", 2),
    new Pawn("white", "H", 2),
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    new Pawn("black", "A", 7),
    new Pawn("black", "B", 7),
    new Pawn("black", "C", 7),
    new Pawn("black", "D", 7),
    new Pawn("black", "E", 7),
    new Pawn("black", "F", 7),
    new Pawn("black", "G", 7),
    new Pawn("black", "H", 7),
  ],

  [
    new Rook("black", "A", 8),
    new Knight("black", "B", 8),
    new Bishop("black", "C", 8),
    new Queen("black", "D", 8),
    new King("black", "E", 8),
    new Bishop("black", "F", 8),
    new Knight("black", "G", 8),
    new Rook("black", "H", 8),
  ],
];

describe("Game", () => {
  it("should set up pieces in starting positions", () => {
    const game = new Game();
    expect(game.state).toMatchObject(startingPositions);
  });
  test("turn number defaults to 1", () => {
    const game = new Game();
    expect(game.turnNumber).toBe(1);
  });
  it("should change move colour after a move is made", () => {
    const game = new Game();
    game.makeMove(new Position("A", 2), new Position("A", 4));
    expect(game.turnColor).toBe("black");
  });
  it("should increase turn number after a pair of moves", () => {
    const game = new Game();
    game.makeMove(new Position("A", 2), new Position("A", 4));
    game.makeMove(new Position("A", 7), new Position("A", 5));
    expect(game.turnNumber).toBe(2);
  });
  test("Piece should move to new position on the board", () => {
    const game = new Game();
    const a2Pawn = game.state[1][0];
    game.makeMove(new Position("A", 2), new Position("A", 4));
    expect(a2Pawn?.currentPosition).toEqual(new Position("A", 4));
    expect(game.state[1][0]).toBeNull();
  });
  test("update last move after a move is taken", () => {
    const game = new Game();
    game.makeMove(new Position("A", 2), new Position("A", 4));
    expect(game.moves.previousMove).toEqual([
      new Position("A", 2),
      new Position("A", 4),
    ]);
    game.makeMove(new Position("A", 7), new Position("A", 5));
    expect(game.moves.previousMove).toEqual([
      new Position("A", 7),
      new Position("A", 5),
    ]);
  });
});

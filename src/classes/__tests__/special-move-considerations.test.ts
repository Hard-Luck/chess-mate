import Game from "../game";
import Position from "../position";

describe("Capturing", () => {
  describe("General", () => {
    it("when a piece is taken its captured property should be set to true", () => {
      const game = new Game();
      const whitePawnPosition = new Position("A", 2);
      const blackPawnPosition = new Position("B", 7);
      const whitePawn = game.getPieceFromPosition(whitePawnPosition);
      const blackPawn = game.getPieceFromPosition(blackPawnPosition);
      game.makeMove(whitePawnPosition, new Position("A", 4));
      game.makeMove(blackPawnPosition, new Position("B", 5));
      game.makeMove(whitePawn!.currentPosition, blackPawn!.currentPosition);
      expect(blackPawn?.isCaptured).toBe(true);
    });
  });
  describe("pawn", () => {
    it("should be able to capture an opponents piece one step forward and diagonal from it", () => {
      const game = new Game();
      const whiteStartingPosition = new Position("A", 2);
      const whitePawn = game.getPieceFromPosition(whiteStartingPosition);
      game.makeMove(whiteStartingPosition, new Position("A", 4));
      game.makeMove(new Position("B", 7), new Position("B", 5));
      expect(whitePawn?.canMoveTo(new Position("B", 5), game)).toBe(true);
    });
    it("should be able to capture with black pawn", () => {
      const game = new Game();
      const blackStartingPosition = new Position("B", 7);
      const blackPawn = game.getPieceFromPosition(blackStartingPosition);
      game.makeMove(new Position("A", 2), new Position("A", 4));
      game.makeMove(new Position("B", 7), new Position("B", 5));
      game.makeMove(new Position("H", 2), new Position("H", 3));
      expect(blackPawn?.canMoveTo(new Position("A", 4), game)).toBe(true);
    });
    it("shouldn't be able to move forward through a piece", () => {
      const game = new Game();
      const whiteStartingPosition = new Position("A", 2);
      const whitePawn = game.getPieceFromPosition(whiteStartingPosition);
      game.makeMove(whiteStartingPosition, new Position("A", 4));
      game.makeMove(new Position("A", 7), new Position("A", 5));
      expect(whitePawn?.canMoveTo(new Position("A", 5), game)).toBe(false);
    });
    it("shouldn't be able to jump over a piece", () => {
      const game = new Game();
      const whiteStartingPosition = new Position("A", 2);
      const whitePawn = game.getPieceFromPosition(whiteStartingPosition);
      // Move black pawn to A3 to attempt to jump over to A4 while moving H -pawn just to take turn
      game.makeMove(new Position("H", 2), new Position("H", 3));
      game.makeMove(new Position("A", 7), new Position("A", 5));
      game.makeMove(new Position("H", 3), new Position("H", 4));
      game.makeMove(new Position("A", 5), new Position("A", 4));
      game.makeMove(new Position("H", 4), new Position("H", 5));
      game.makeMove(new Position("A", 4), new Position("A", 3));

      expect(whitePawn?.canMoveTo(new Position("A", 4), game)).toBe(false);
    });
  });
});

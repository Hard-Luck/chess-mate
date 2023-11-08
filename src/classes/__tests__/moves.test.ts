import Moves from "@/classes/moves";
describe("Moves", () => {
  describe("properties", () => {
    test("turn number defaults to 1", () => {
      const moves = new Moves();
      expect(moves.turnNumber).toBe(1);
    });
    test("starting plater defaults to white", () => {
      const moves = new Moves();
      expect(moves.playerTurnColor).toBe("white");
    });
    test("gameMoves defaults to empty array", () => {
      const moves = new Moves();
      expect(moves.history).toEqual([]);
    });
    test("previousMove defaults to null", () => {
      const moves = new Moves();
      expect(moves.previousMove).toBeNull();
    });
  });
  describe("Methods", () => {
    test("nextTurn increments turn number", () => {
      const moves = new Moves();
      moves.nextTurn();
      expect(moves.turnNumber).toBe(2);
    });
    test("nextPlayer changes active player", () => {
      const moves = new Moves();
      moves.nextPlayer();
      expect(moves.playerTurnColor).toBe("black");
    });
    test("if nextPlayer is called twice it should increment the turn", () => {
      const moves = new Moves();
      moves.nextPlayer();
      moves.nextPlayer();
      expect(moves.turnNumber).toBe(2);
      expect(moves.playerTurnColor).toBe("white");
    });
  });
});

import Game from "../game";
import { King, Rook } from "../pieces";
import Position from "../position";
import { defaultSetUpBoard } from "./chessboards/setup-chessboard";
afterEach(() => jest.resetAllMocks());
describe("gamePlay", () => {
  describe("properties", () => {
    it("has won property defaulting to null", () => {
      const game = new Game();
      expect(game.winner).toBeNull();
    });
    it("is set up with default board state", () => {
      const game = new Game();
      const startingPosition = game.state;
      expect(startingPosition).toEqual(defaultSetUpBoard);
    });
    it("has turn number default to 1", () => {
      const game = new Game();
      expect(game.turnNumber).toBe(1);
    });
    it("has turn color default to white", () => {
      const game = new Game();
      expect(game.turnColor).toBe("white");
    });
  });
  describe("methods", () => {
    describe("makeMove", () => {
      test("when castling both king and rook to have moved and hasMoved properties change to true", () => {
        const game = new Game();
        game.makeMove(new Position("E", 2), new Position("E", 4));
        game.makeMove(new Position("E", 7), new Position("E", 5));
        game.makeMove(new Position("G", 1), new Position("F", 3));
        game.makeMove(new Position("G", 8), new Position("F", 6));
        game.makeMove(new Position("F", 1), new Position("E", 2));
        game.makeMove(new Position("F", 8), new Position("E", 7));
        const blackRook = game.getPieceAtPosition(new Position("H", 8)) as Rook;
        const whiteRook = game.getPieceAtPosition(new Position("H", 1)) as Rook;
        const blackKing = game.getPieceAtPosition(new Position("E", 8)) as King;
        const whiteKing = game.getPieceAtPosition(new Position("E", 1)) as King;
        expect(blackRook.hasMoved).toBe(false);
        expect(whiteRook.hasMoved).toBe(false);
        expect(blackKing.hasMoved).toBe(false);
        expect(whiteKing.hasMoved).toBe(false);
        const whiteKingCastlingPosition = new Position("G", 1);
        const blackKingCastlingPosition = new Position("G", 8);
        game.makeMove(whiteKing.currentPosition, whiteKingCastlingPosition);
        game.makeMove(blackKing.currentPosition, blackKingCastlingPosition);
        expect(blackRook.hasMoved).toBe(true);
        expect(whiteRook.hasMoved).toBe(true);
        expect(blackKing.hasMoved).toBe(true);
        expect(whiteKing.hasMoved).toBe(true);
        const expectedBlackRookPosition = new Position("F", 8);
        const expectedWhiteRookPosition = new Position("F", 1);
        expect(blackRook.currentPosition).toEqual(expectedBlackRookPosition);
        expect(whiteRook.currentPosition).toEqual(expectedWhiteRookPosition);
      });
      test("cannot castle if king has moved", () => {
        const game = new Game();
        game.makeMove(new Position("E", 2), new Position("E", 4));
        game.makeMove(new Position("E", 7), new Position("E", 5));
        game.makeMove(new Position("G", 1), new Position("F", 3));
        game.makeMove(new Position("G", 8), new Position("F", 6));
        game.makeMove(new Position("F", 1), new Position("D", 3));
        game.makeMove(new Position("F", 8), new Position("D", 6));
        game.makeMove(new Position("E", 1), new Position("E", 2));
        game.makeMove(new Position("E", 8), new Position("E", 7));
        game.makeMove(new Position("E", 2), new Position("E", 1));
        game.makeMove(new Position("E", 7), new Position("E", 8));
        const whiteKing = game.getPieceAtPosition(new Position("E", 1)) as King;
        const blackKing = game.getPieceAtPosition(new Position("E", 8)) as King;
        const whiteKingPossibleMoves = game.possibleMovesFor(whiteKing);
        const blackKingPossibleMoves = game.possibleMovesFor(blackKing);
        const whiteKingCastlingPosition = new Position("G", 1);
        const blackKingCastlingPosition = new Position("G", 8);
        expect(whiteKingPossibleMoves).not.toContainEqual(
          whiteKingCastlingPosition
        );
        expect(blackKingPossibleMoves).not.toContainEqual(
          blackKingCastlingPosition
        );
      });
      it("should update winner to draw if stalemate is achieved", () => {
        const game = new Game();
        // stalemate check will be true after move
        game.stalemateReached = jest.fn().mockImplementation(() => true);
        game.makeMove(new Position("E", 2), new Position("E", 4));
        expect(game.winner).toBe("draw");
      });
      it("should update winner if checkmate is achieved", () => {
        const game = new Game();
        game.checkmateReached = jest.fn().mockImplementation(() => true);
        game.makeMove(new Position("E", 2), new Position("E", 4));
        expect(game.winner).toBe("white");
      });
      test("cannot make move if game is complete", () => {
        const game = new Game();
        game.checkmateReached = jest.fn().mockImplementation(() => true);
        game.makeMove(new Position("E", 2), new Position("E", 4));
        expect(game.turnColor).toBe("white");
        game.makeMove(new Position("E", 7), new Position("E", 5));
        expect(game.lastMove).toEqual([
          new Position("E", 2),
          new Position("E", 4),
        ]);
      });
    });
  });
});

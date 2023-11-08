import Game from "@/classes/game";
import ChessBoard from "../chessboard";
import { defaultSetUpBoard } from "./chessboards/default-setup-chessboard";

describe("Chessboard", () => {
  it("should set up pieces in starting positions when passed no parameter", () => {
    const game = new ChessBoard();
    expect(game.state).toMatchObject(defaultSetUpBoard);
  });
  test("turn number defaults to 1", () => {
    const game = new Game();
    expect(game.turnNumber).toBe(1);
  });
});

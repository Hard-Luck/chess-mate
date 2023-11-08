import ChessBoard from "@/classes/chessboard";
import { defaultSetUpBoard } from "./chessboards/default-setup-chessboard";

describe("Chessboard", () => {
  it("should set up pieces in starting positions when passed no parameter", () => {
    const game = new ChessBoard();
    expect(game.state).toMatchObject(defaultSetUpBoard);
  });
});

import ChessBoard from "../board";
import Position from "../position";
import { defaultSetUpBoard } from "./chessboards/setup-chessboard";

describe("Chessboard", () => {
  it("should set up pieces in starting positions when passed no parameter", () => {
    const board = new ChessBoard();
    expect(board.state).toMatchObject(defaultSetUpBoard);
  });
  test("piece position should be updated after movePiece is called", () => {
    const board = new ChessBoard();
    const piece = board.getPieceFromPosition(new Position("A", 2));
    board.movePiece(piece!.currentPosition!, new Position("A", 4));
    expect(piece?.currentPosition).toEqual(new Position("A", 4));
  });
});

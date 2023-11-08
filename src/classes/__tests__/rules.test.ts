import {
  DiagonalMoveValidator,
  HorizontalMoveValidator,
  PawnMoveValidator,
} from "../validators";
import ChessBoard from "../chessboard";
import Position from "../position";
import { pieceIsBishop, pieceIsPawn, pieceIsRook } from "../utils";
describe("General", () => {
  test("shouldn't be able to move onto square with own piece on", () => {
    const board = new ChessBoard();
    // put knight on square in front of pawn
    board.movePiece(new Position("B", 2), new Position("A", 3));
    const moveFrom = new Position("A", 2);
    const moveTo = new Position("A", 3);
    const pawn = board.getPieceFromPosition(moveFrom);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(pawn, moveFrom, moveTo, board);
      expect(validator.validateMove()).toBe(false);
    }
    const rookToForward = new Position("A", 2);
    const rookToSideways = new Position("B", 1);
    const rookFrom = new Position("A", 1);
    const rook = board.getPieceFromPosition(rookFrom);
    if (pieceIsRook(rook)) {
      const validatorForwards = new HorizontalMoveValidator(
        rook,
        rookFrom,
        rookToForward,
        board
      );
      const validatorSideways = new HorizontalMoveValidator(
        rook,
        rookFrom,
        rookToSideways,
        board
      );
      expect(validatorForwards.validateMove()).toBe(false);
      expect(validatorSideways.validateMove()).toBe(false);
    }
  });
  it("when a piece is taken its captured property should be set to true", () => {
    const board = new ChessBoard();
    const whitePawnPosition = new Position("A", 2);
    const blackPawnPosition = new Position("B", 7);
    const whitePawn = board.getPieceFromPosition(whitePawnPosition);
    const blackPawn = board.getPieceFromPosition(blackPawnPosition);
    board.movePiece(whitePawnPosition, new Position("A", 4));
    board.movePiece(blackPawnPosition, new Position("B", 5));
    board.movePiece(whitePawn!.currentPosition, blackPawn!.currentPosition);
    expect(blackPawn?.isCaptured).toBe(true);
  });
});
describe("PawnMoveValidator", () => {
  it("should validate pawn taking a piece (white pawn)", () => {
    const board = new ChessBoard();
    board.movePiece(new Position("A", 2), new Position("A", 4));
    board.movePiece(new Position("B", 7), new Position("B", 5));
    const moveTo = new Position("B", 5);
    const moveFrom = new Position("A", 4);
    const pawn = board.getPieceFromPosition(moveFrom);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(pawn, moveFrom, moveTo, board);
      expect(validator.validateMove()).toBe(true);
    }
  });
  it("should validate pawn taking a piece (white pawn)", () => {
    const board = new ChessBoard();
    board.movePiece(new Position("B", 7), new Position("B", 5));
    board.movePiece(new Position("A", 2), new Position("A", 4));
    board.movePiece(new Position("H", 2), new Position("H", 3));
    const moveTo = new Position("A", 4);
    const moveFrom = new Position("B", 5);
    const pawn = board.getPieceFromPosition(moveFrom);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(pawn, moveFrom, moveTo, board);
      expect(validator.validateMove()).toBe(true);
    }
  });
  it("shouldn't be able to move forward through a piece", () => {
    const board = new ChessBoard();
    board.movePiece(new Position("A", 2), new Position("A", 4));
    board.movePiece(new Position("A", 7), new Position("A", 5));
    const pawn = board.getPieceFromPosition(new Position("A", 4));
    const moveFrom = new Position("A", 4);
    const moveTo = new Position("A", 5);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(pawn, moveFrom, moveTo, board);
      expect(validator.validateMove()).toBe(false);
    }
  });
  it("shouldn't be able to jump over a piece", () => {
    const board = new ChessBoard();
    board.movePiece(new Position("A", 7), new Position("A", 3));
    const from = new Position("A", 2);
    const pawn = board.getPieceFromPosition(from);
    const to = new Position("A", 4);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(pawn, from, to, board);
      expect(validator.validateMove()).toBe(false);
    }
  });
});
describe("DiagonalMoveValidator", () => {
  it("should validate diagonal move", () => {
    const board = new ChessBoard();
    board.movePiece(new Position("D", 2), new Position("D", 4));
    const moveFrom = new Position("C", 1);
    const moveTo = new Position("H", 6);
    const bishop = board.getPieceFromPosition(moveFrom);
    if (pieceIsBishop(bishop)) {
      const validator = new DiagonalMoveValidator(
        bishop,
        moveFrom,
        moveTo,
        board
      );
      expect(validator.validateMove()).toBe(true);
    }
  });
});
it("shouldn't be able to move diagonally through a piece", () => {
  const board = new ChessBoard();
  const moveFrom = new Position("C", 1);
  const moveTo = new Position("E", 3);
  const bishop = board.getPieceFromPosition(moveFrom);
  if (pieceIsBishop(bishop)) {
    const validator = new DiagonalMoveValidator(
      bishop,
      moveFrom,
      moveTo,
      board
    );
    expect(validator.validateMove()).toBe(false);
  }
});

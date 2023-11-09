import {
  DiagonalMoveValidator,
  HorizontalMoveValidator,
  PawnMoveValidator,
  VerticalMoveValidator,
} from "../validators";
import Position from "../position";
import { pieceIsBishop, pieceIsPawn, pieceIsRook } from "../utils";
import { Pawn } from "../pieces";
import { Move } from "../game";
import ChessBoard from "../board";

describe("General", () => {
  test("shouldn't be able to move onto square with own piece on", () => {
    const board = new ChessBoard();
    // put knight on square in front of pawn
    board.movePiece(new Position("B", 2), new Position("A", 3));
    const moveFrom = new Position("A", 2);
    const moveTo = new Position("A", 3);
    const pawn = board.getPieceFromPosition(moveFrom);
    if (pieceIsPawn(pawn)) {
      const validator = new PawnMoveValidator(board, pawn, moveTo);
      expect(validator.validateMove()).toBe(false);
    }
    const rookToForward = new Position("A", 2);
    const rookToSideways = new Position("B", 1);
    const rookFrom = new Position("A", 1);
    const rook = board.getPieceFromPosition(rookFrom);
    if (pieceIsRook(rook)) {
      const validatorForwards = new VerticalMoveValidator(
        board,
        rook,
        rookToForward
      );
      const validatorSideways = new HorizontalMoveValidator(
        board,
        rook,
        rookToSideways
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
  describe("validate", () => {
    it("should validate pawn taking a piece (white pawn)", () => {
      const board = new ChessBoard();
      board.movePiece(new Position("A", 2), new Position("A", 4));
      board.movePiece(new Position("B", 7), new Position("B", 5));
      const moveTo = new Position("B", 5);
      const moveFrom = new Position("A", 4);
      const pawn = board.getPieceFromPosition(moveFrom);
      if (pieceIsPawn(pawn)) {
        const validator = new PawnMoveValidator(board, pawn, moveTo);
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
        const validator = new PawnMoveValidator(board, pawn, moveTo);
        expect(validator.validateMove()).toBe(true);
      }
    });
    it("shouldn't be able to move forward through a piece", () => {
      const board = new ChessBoard();
      board.movePiece(new Position("A", 2), new Position("A", 4));
      board.movePiece(new Position("A", 7), new Position("A", 5));
      const pawn = board.getPieceFromPosition(new Position("A", 4));
      const moveTo = new Position("A", 5);
      if (pieceIsPawn(pawn)) {
        const validator = new PawnMoveValidator(board, pawn, moveTo);
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
        const validator = new PawnMoveValidator(board, pawn, to);
        expect(validator.validateMove()).toBe(false);
      }
    });
  });
  describe("possibleMoves", () => {
    it("should return available moves for unmoved white pawn", () => {
      const board = new ChessBoard();
      const pawn = new Pawn("white", "A", 2);
      const validator = new PawnMoveValidator(board, pawn);
      const moves = validator.possibleMoves();
      const expectedMoves = [new Position("A", 3), new Position("A", 4)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
    it("should return available moves for a black pawn ", () => {
      const board = new ChessBoard();
      const pawn = new Pawn("black", "A", 7);
      const validator = new PawnMoveValidator(board, pawn);
      const moves = validator.possibleMoves();
      const expectedMoves = [new Position("A", 6), new Position("A", 5)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
    it("should return available moves for en Passant", () => {
      const board = new ChessBoard();
      const pawn = new Pawn("white", "A", 5);
      const validator = new PawnMoveValidator(board, pawn, undefined, [
        new Position("B", 7),
        new Position("B", 5),
      ]);
      const expectedMoves = [new Position("B", 6), new Position("A", 6)];
      const moves = validator.possibleMoves();
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
    it("should return available moves when a pawn can capture", () => {
      const board = new ChessBoard();
      const pawn = new Pawn("white", "A", 4);
      board.setPosition(new Position("A", 4), pawn);
      board.setPosition(new Position("B", 5), new Pawn("black", "B", 5));
      const validator = new PawnMoveValidator(board, pawn);
      const moves = validator.possibleMoves();
      const expectedMoves = [new Position("A", 5), new Position("B", 5)];
      expect(moves.length).toBe(2);
      expectedMoves.forEach((move) => {
        expect(moves).toContainEqual(move);
      });
    });
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
      const validator = new DiagonalMoveValidator(board, bishop, moveTo);
      expect(validator.validateMove()).toBe(true);
    }
  });

  it("shouldn't be able to move diagonally through a piece", () => {
    const board = new ChessBoard();
    const moveFrom = new Position("C", 1);
    const moveTo = new Position("E", 3);
    const bishop = board.getPieceFromPosition(moveFrom);
    if (pieceIsBishop(bishop)) {
      const validator = new DiagonalMoveValidator(board, bishop, moveTo);
      expect(validator.validateMove()).toBe(false);
    }
  });
});
describe("VerticalMoveValidator", () => {
  it("should validate vertical move", () => {
    const board = new ChessBoard();
    // remove a pawn for rook to move
    board.setPosition(new Position("A", 2), null);
    const moveFrom = new Position("A", 1);
    const moveTo = new Position("A", 6);
    const rook = board.getPieceFromPosition(moveFrom);
    if (pieceIsRook(rook)) {
      const validator = new VerticalMoveValidator(board, rook, moveTo);
      expect(validator.validateMove()).toBe(true);
    }
  });
  it("shouldn't vertical move through a piece", () => {
    const board = new ChessBoard();
    const moveFrom = new Position("A", 1);
    const moveTo = new Position("A", 6);
    const rook = board.getPieceFromPosition(moveFrom);
    if (pieceIsRook(rook)) {
      const validator = new VerticalMoveValidator(board, rook, moveTo);
      expect(validator.validateMove()).toBe(false);
    }
  });
});

describe("special considerations", () => {
  describe("en Passant", () => {
    it("should be able to take en Passant", () => {
      const board = new ChessBoard();
      const pawn = new Pawn("white", "A", 5);
      const previousMove = [new Position("B", 7), new Position("B", 5)] as Move;
      const validator = new PawnMoveValidator(
        board,
        pawn,
        new Position("B", 6),
        previousMove
      );
      expect(validator.validateMove()).toBe(true);
    });
  });
});

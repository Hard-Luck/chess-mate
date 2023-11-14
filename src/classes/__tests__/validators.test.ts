import {
  DiagonalMoveValidator,
  HorizontalMoveValidator,
  PawnMoveValidator,
  VerticalMoveValidator,
} from "../validators";
import Position from "../position";
import { pieceIsBishop, pieceIsPawn, pieceIsRook } from "../utils";
import { Bishop, Pawn, Rook } from "../pieces";
import ChessBoard from "../board";
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
  describe("validateMoves", () => {
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
  describe("possibleMoves", () => {
    it("should return available moves", () => {
      const board = new ChessBoard();
      // Add bishop to middle of board
      const bishop = new Bishop("white", "E", 3);
      const validator = new DiagonalMoveValidator(board, bishop);
      const moves = validator.possibleMoves();
      const expectedMoves = [
        new Position("F", 4),
        new Position("G", 5),
        new Position("H", 6),
        new Position("D", 4),
        new Position("C", 5),
        new Position("B", 6),
        new Position("A", 7),
      ];
      expect(moves.length).toBe(7);
      moves.forEach((move) => {
        expect(expectedMoves).toContainEqual(move);
      });
    });
  });
});
describe("VerticalMoveValidator", () => {
  describe("validateMoves", () => {
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
  describe("possibleMoves", () => {
    it("should return available vertical moves", () => {
      const board = new ChessBoard();
      // remove a pawn and original rook
      board.setPosition(new Position("A", 2), null);
      board.setPosition(new Position("A", 1), null);
      // set new rook to middle of file
      const placedRookPosition = new Position("A", 4);
      const rook = new Rook("white", "A", 4);
      board.setPosition(placedRookPosition, rook);
      const validator = new VerticalMoveValidator(board, rook);
      const moves = validator.possibleMoves();
      const expectedMoves = [
        new Position("A", 1),
        new Position("A", 2),
        new Position("A", 3),
        new Position("A", 5),
        new Position("A", 6),
        new Position("A", 7),
      ];
      expect(moves.length).toBe(6);
      moves.forEach((move) => {
        expect(expectedMoves).toContainEqual(move);
      });
    });
  });
});
describe("HorizontalMoveValidator", () => {
  describe("validateMoves", () => {
    it("should validate Horizontal move", () => {
      const board = new ChessBoard();
      // setRook on open rank
      const moveFrom = new Position("A", 3);
      const moveTo = new Position("C", 3);
      board.movePiece(new Position("A", 1), new Position("A", 3));
      const rook = board.getPieceFromPosition(moveFrom);
      if (pieceIsRook(rook)) {
        const validator = new HorizontalMoveValidator(board, rook, moveTo);
        expect(validator.validateMove()).toBe(true);
      }
    });
    it("shouldn't horizontal move through a piece", () => {
      const board = new ChessBoard();
      board.setPosition(new Position("C", 1), null);
      const moveFrom = new Position("A", 1);
      const moveTo = new Position("C", 1);
      const rook = board.getPieceFromPosition(moveFrom);
      if (pieceIsRook(rook)) {
        const validator = new HorizontalMoveValidator(board, rook, moveTo);
        expect(validator.validateMove()).toBe(false);
      }
    });
  });
  describe("possibleMoves", () => {
    it("should return available vertical moves", () => {
      const board = new ChessBoard();
      // set new rook to middle of file
      const rook = new Rook("white", "C", 4);
      const placedRookPosition = rook.currentPosition;
      board.setPosition(placedRookPosition, rook);
      const validator = new HorizontalMoveValidator(board, rook);
      const moves = validator.possibleMoves();
      const expectedMoves = [
        new Position("A", 4),
        new Position("B", 4),
        new Position("D", 4),
        new Position("E", 4),
        new Position("F", 4),
        new Position("G", 4),
        new Position("H", 4),
      ];
      expect(moves.length).toBe(7);
      moves.forEach((move) => {
        expect(expectedMoves).toContainEqual(move);
      });
    });
  });
});

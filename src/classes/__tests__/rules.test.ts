import {
  HorizontalMoveValidator,
  KingMoveValidator,
  PawnMoveValidator,
  VerticalMoveValidator,
} from "../validators";
import Position from "../position";
import { pieceIsPawn, pieceIsRook } from "../utils";
import { King, Pawn, Queen, Rook } from "../pieces";
import { Move } from "../game";
import ChessBoard from "../board";
import {
  checkMatePosition1,
  checkMatePosition2,
  exposingKingPosition,
  generateEmptyChessBoard,
  queenOnBFile,
  staleMatePosition1,
  staleMatePosition2,
} from "./chessboards/setup-chessboard";
import Rules from "../rules";

beforeEach(() => {
  jest.resetModules();
});
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
  describe("castling", () => {
    describe("isCastingMove", () => {
      it("should return true when an attempted castling move is made", () => {
        const emptyChessBoard = generateEmptyChessBoard();
        const board = new ChessBoard(emptyChessBoard);
        const king = new King("white", "E", 1);
        const rook = new Rook("white", "A", 1);
        board.setPosition(king.currentPosition, king);
        board.setPosition(rook.currentPosition, rook);
        const validator = new KingMoveValidator(
          board,
          king,
          new Position("C", 1)
        );
        expect(validator.isCastlingMove()).toBe(true);
      });
      it("should return true when an attempted castling move is made", () => {
        const emptyChessBoard = generateEmptyChessBoard();
        const board = new ChessBoard(emptyChessBoard);
        const king = new King("white", "E", 1);
        const rook = new Rook("white", "A", 1);
        board.setPosition(king.currentPosition, king);
        board.setPosition(rook.currentPosition, rook);
        const validator = new KingMoveValidator(
          board,
          king,
          new Position("C", 1)
        );
        expect(validator.isCastlingMove()).toBe(true);
      });
    });
    describe("validateCastlingMove", () => {
      it("should return true when no pieces block the castling", () => {
        const emptyChessBoard = generateEmptyChessBoard();
        const board = new ChessBoard(emptyChessBoard);
        const king = new King("white", "E", 1);
        const rook = new Rook("white", "A", 1);
        const opposingQueen = new Queen("black", "F", 8);
        board.setPosition(king.currentPosition, king);
        board.setPosition(rook.currentPosition, rook);
        board.setPosition(opposingQueen.currentPosition, opposingQueen);
        const validator = new KingMoveValidator(
          board,
          king,
          new Position("C", 1)
        );
        expect(validator.validateCastlingMove()).toBe(true);
      });
      it("should return false when trying to pass through a check", () => {
        const emptyChessBoard = generateEmptyChessBoard();

        const board = new ChessBoard(emptyChessBoard);
        const king = new King("white", "E", 1);
        const rook = new Rook("white", "A", 1);
        const opposingQueen = new Queen("black", "C", 8);
        board.setPosition(king.currentPosition, king);
        board.setPosition(rook.currentPosition, rook);
        board.setPosition(opposingQueen.currentPosition, opposingQueen);
        const validator = new KingMoveValidator(
          board,
          king,
          new Position("C", 1)
        );
        expect(validator.validateCastlingMove()).toBe(false);
      });
      it("should return false when castling out of check", () => {
        const emptyChessBoard = generateEmptyChessBoard();
        const board = new ChessBoard(emptyChessBoard);
        const king = new King("white", "E", 1);
        const rook = new Rook("white", "A", 1);
        const opposingQueen = new Queen("black", "E", 8);
        board.setPosition(king.currentPosition, king);
        board.setPosition(rook.currentPosition, rook);
        board.setPosition(opposingQueen.currentPosition, opposingQueen);
        king.checked = true;
        const validator = new KingMoveValidator(
          board,
          king,
          new Position("C", 1)
        );
        expect(validator.validateCastlingMove()).toBe(false);
      });
    });
    it("should show castling moves in possible moves", () => {
      const emptyChessBoard = generateEmptyChessBoard();
      const board = new ChessBoard(emptyChessBoard);
      const king = new King("white", "E", 1);
      const rook = new Rook("white", "A", 1);
      board.setPosition(new Position("E", 1), king);
      board.setPosition(new Position("A", 1), rook);
      const validator = new KingMoveValidator(board, king);
      const moves = validator.possibleMoves();
      expect(moves).toContainEqual(new Position("C", 1));
    });
  });
});

describe("checks", () => {
  describe("inCheck", () => {
    it("should return true when king is in check", () => {
      const emptyChessBoard = generateEmptyChessBoard();
      const board = new ChessBoard(emptyChessBoard);
      const rules = new Rules(board);
      const king = new King("black", "E", 1);
      const opposingQueen = new Queen("white", "E", 8);
      const queenPosition = opposingQueen.currentPosition;
      const kingPosition = king.currentPosition;
      board.setPosition(kingPosition, king);
      board.setPosition(queenPosition, opposingQueen);
      expect(rules.inCheck("black")).toBe(true);
    });
    it("should return false when king is not in check  ", () => {
      const emptyChessBoard = generateEmptyChessBoard();

      const board = new ChessBoard(emptyChessBoard);
      const rules = new Rules(board);
      const king = new King("white", "A", 1);
      const opposingQueen = new Queen("black", "E", 2);
      const queenPosition = opposingQueen.currentPosition;
      const kingPosition = king.currentPosition;
      board.setPosition(kingPosition, king);
      board.setPosition(queenPosition, opposingQueen);
      expect(rules.inCheck("white")).toBe(false);
    });
    it("should return true when passed a position that would be in check", () => {
      const emptyChessBoard = generateEmptyChessBoard();

      const board = new ChessBoard(emptyChessBoard);
      const rules = new Rules(board);
      const king = new King("black", "A", 8);
      const opposingQueen = new Queen("white", "B", 2);
      const queenPosition = opposingQueen.currentPosition;
      const kingPosition = king.currentPosition;
      board.setPosition(kingPosition, king);
      board.setPosition(queenPosition, opposingQueen);
      expect(rules.inCheck("black", new Position("B", 8))).toBe(true);
    });
    it("should return false when a move wouldn't be in check", () => {
      const emptyChessBoard = generateEmptyChessBoard();

      const board = new ChessBoard(emptyChessBoard);
      const rules = new Rules(board);
      const king = new King("black", "A", 8);
      const opposingQueen = new Queen("white", "B", 2);
      const queenPosition = opposingQueen.currentPosition;
      const kingPosition = king.currentPosition;
      board.setPosition(kingPosition, king);
      board.setPosition(queenPosition, opposingQueen);
      expect(rules.inCheck("black", new Position("A", 7))).toBe(false);
    });
  });
  describe("wouldBeInCheck", () => {
    it("should return true when a king moves into check", () => {
      const board = new ChessBoard(queenOnBFile);
      const rules = new Rules(board);
      const king = new King("black", "A", 1);
      const kingPosition = king.currentPosition;
      expect(rules.wouldBeInCheck(kingPosition, new Position("B", 1))).toBe(
        true
      );
    });
    it("should return false when a king moves out of check", () => {
      const board = new ChessBoard(queenOnBFile);
      const rules = new Rules(board);
      const king = new King("white", "B", 1);
      const kingPosition = king.currentPosition;
      expect(rules.wouldBeInCheck(kingPosition, new Position("A", 1))).toBe(
        false
      );
    });
    it("should return true when a pice moves that exposes the king", () => {
      const board = new ChessBoard(exposingKingPosition);
      const rules = new Rules(board);
      const bishopPosition = new Position("C", 1);
      const badBishopMove = new Position("D", 2);
      expect(rules.wouldBeInCheck(bishopPosition, badBishopMove)).toBe(true);
    });
    it.todo("should return false when a pice moves and blocks the check");
    it.todo("should return false when a move would not be in check");
  });
});
describe("win conditions", () => {
  describe("stalemate", () => {
    it("should return true when stalemated - pattern 1 only queen", () => {
      const position = staleMatePosition1;
      const board = new ChessBoard(position);
      const rules = new Rules(board);
      expect(rules.stalemate()).toBe(true);
    });
    it("should return true when stalemated - pattern 2 queen and rook", () => {
      const position = staleMatePosition2;
      const board = new ChessBoard(position);
      const rules = new Rules(board);
      expect(rules.stalemate()).toBe(true);
    });
    it("should return false when not stalemated", () => {
      const board = new ChessBoard();
      const rules = new Rules(board);
      expect(rules.stalemate()).toBe(false);
    });
  });
  describe("checkmate", () => {
    it("should return true when checkmate", () => {
      const position = checkMatePosition1;
      const board = new ChessBoard(position);
      const rules = new Rules(board);
      expect(rules.checkmate()).toBe(true);
    });
    it("should return false when not checkmate", () => {
      const position = checkMatePosition2;
      const board = new ChessBoard(position);
      const rules = new Rules(board);
      expect(rules.checkmate()).toBe(false);
    });
  });
});

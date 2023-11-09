/*   ROOKS
    if (board.getPieceFromPosition(position)?.pieceColor === this.pieceColor)
      return false;
    const { rank, file } = this.currentPosition.distanceFrom(position);
    if (file === 0) {
      const check = this.checkFile(rank, board);
      return check;
    }
    if (rank === 0) {
      return this.checkRank(file, board);
    }
    return false;
  }
  possibleMoves(board: ChessBoard): Position[] {
    return this.availableStraightMoves(board);
  }

  BISHOPS

  const pieceCheck = board.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
    const distance = this.currentPosition.distanceFrom(position);
    if (!(Math.abs(distance.rank) === Math.abs(distance.file))) return false;
    return this.checkDiagonal(distance, board);
  }
  possibleMoves(board: ChessBoard): Position[] {
    return this.availableDiagonals(board);
  }


  KNIGHTS

   const pieceCheck = board.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;


    QUEEN
    possibleMoves(board: ChessBoard): Position[] {
    const moves = [] as Position[];
    const knightMoves = [
      [-2, -1],
      [-1, -2],
      [2, -1],
      [1, -2],
      [-2, 1],
      [-1, 2],
      [2, 1],
      [1, 2],
    ];
    for (const move of knightMoves) {
      const { currentFile, currentRank: rank } = this.currentPosition;
      const fileAsNum = Position.fileToNumber(currentFile);
      const fileToCheck = fileAsNum + move[0];
      const rankToCheck = (rank + move[1]) as PositionRank;
      if (
        fileToCheck > 8 ||
        fileToCheck < 1 ||
        rankToCheck < 1 ||
        rankToCheck > 8
      ) {
        continue;
      }
      const file = Position.numberToFile(fileToCheck);
      const position = new Position(file, rankToCheck);
      if (this.canMoveTo(position, board)) moves.push(position);
    }
    return moves;
  }

  const pieceCheck = board.getPieceFromPosition(position);
    if (pieceCheck?.pieceColor === this.pieceColor) return false;
    const distance = this.currentPosition.distanceFrom(position);
    if (Math.abs(distance.rank) === Math.abs(distance.file)) {
      return this.checkDiagonal(distance, board);
    }
    if (distance.file === 0) {
      return this.checkFile(distance.rank, board);
    }
    if (distance.rank === 0) {
      return this.checkRank(distance.file, board);
    }
    return false;
  }
  possibleMoves(board: ChessBoard): Position[] {
    const diagonalMoves = this.availableDiagonals(board);
    const straightMoves = this.availableStraightMoves(board);
    const moves = [...diagonalMoves, ...straightMoves];
    return moves;
  }


  KING

   const pieceCheck = board.getPieceFromPosition(position);
  if (pieceCheck?.pieceColor === this.pieceColor) return false;
  const { rank, file } = this.currentPosition.distanceFrom(position);
  possibleMoves(board: ChessBoard): Position[] {
    const moves: Position[] = [];
    const { currentRank, currentFile } = this.currentPosition;
    const fileAsNum = Position.fileToNumber(currentFile);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const rank = (currentRank + j) as PositionRank;
        const newFileAsNum = fileAsNum + i;
        if (newFileAsNum < 1 || newFileAsNum > 8 || rank < 1 || rank > 8)
          continue;
        const file = Position.numberToFile(newFileAsNum);
        if (this.canMoveTo(new Position(file, rank), board))
          moves.push(new Position(file, rank));
      }
    }
    return moves;
  }


  public inCheck(kingLocation: Position) {
    const king = this.board.getPieceFromPosition(kingLocation);
    const { currentRank: rank, currentFile: file } = kingLocation;
    for (const piece of this.board.state.flat()) {
      if (piece?.pieceColor !== king?.pieceColor) {
        const possibleMoves = piece?.possibleMoves(this.board);
        if (!possibleMoves) continue;
        for (const move of possibleMoves) {
          if (move.currentRank === rank && move.currentFile === file) {
            return true;
          }
        }
      }
    }
    return false;
  }
  public makeMove(from: Position, to: Position) {
    const pieceToMove = this.board.getPieceFromPosition(from);
    if (!pieceToMove || pieceToMove.pieceColor !== this.playerTurn) {
      throw new Error(`${!pieceToMove}`);
    }
    const forward = this.playerTurn === "white" ? 1 : -1;
    if (pieceIsPawn(pieceToMove) && pieceToMove.checkEnPassant(this.board)) {
      const enPassantPosition = new Position(
        to.currentFile,
        (to.currentRank - forward) as PositionRank
      );
      const enPassantPiece = this.board.getPieceFromPosition(enPassantPosition);
      if (enPassantPiece) {
        enPassantPiece.isCaptured = true;
        this.board.setPosition(from, null);
        this.board.setPosition(enPassantPosition, null);
        this.board.setPosition(to, pieceToMove);
        this.playerTurn = this.playerTurn === "black" ? "white" : "black";
        if (this.playerTurn === "white") this.moves.nextTurn();
        this.moves.addMove([from, enPassantPosition]);
        const opponentsKingLocation = this.board.kingLocation(this.playerTurn);
        if (this.inCheck(opponentsKingLocation)) {
          const king = this.board.getPieceFromPosition(
            opponentsKingLocation
          ) as King;
          king.checked = true;
        }
        return [...this.board.state];
      }
    }
    const endPiece = this.board.getPieceFromPosition(to);
    pieceToMove.moveTo(to, this.board);
    if (endPiece?.pieceColor === pieceToMove.pieceColor) {
      throw new Error("Cannot capture own piece");
    }
    endPiece && (endPiece.isCaptured = true);
    this.board.setPosition(to, pieceToMove);
    this.board.setPosition(from, null);
    this.playerTurn = this.playerTurn === "black" ? "white" : "black";
    if (this.playerTurn === "white") this.moves.nextTurn();
    this.moves.addMove([from, to]);
    const opponentsKingLocation = this.board.kingLocation(this.playerTurn);
    if (this.inCheck(opponentsKingLocation)) {
      const king = this.board.getPieceFromPosition(
        opponentsKingLocation
      ) as King;
      king.checked = true;
    }
    return [...this.board.state];
  }
  abstract possibleMoves(board: ChessBoard): Position[];

 
 
  availableStraightMoves(board: ChessBoard) {
    const { currentFile, currentRank } = this.currentPosition;
    const moves: Position[] = [];
    for (let i = 1; i < currentRank; i++) {
      const move = new Position(currentFile, i as PositionRank);
      if (this.canMoveTo(move, board)) moves.push(move);
    }
    for (let i = currentRank + 1; i < 9; i++) {
      const move = new Position(currentFile, i as PositionRank);
      if (this.canMoveTo(move, board)) moves.push(move);
    }
    const currentFileIndex = Position.fileToNumber(currentFile);
    for (let i = 1; i < currentFileIndex; i++) {
      const move = new Position(Position.numberToFile(i), currentRank);
      if (this.canMoveTo(move, board)) moves.push(move);
    }
    for (let i = currentFileIndex + 1; i < 9; i++) {
      const move = new Position(Position.numberToFile(i), currentRank);
      if (this.canMoveTo(move, board)) moves.push(move);
    }
    return moves;
  }
  availableDiagonals(board: ChessBoard): Position[] {
    const { currentFile, currentRank } = this.currentPosition;
    const fileAsNum = Position.fileToNumber(currentFile);
    const moves: Position[] = [];
    const directions: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    directions.forEach(([fileOffset, rankOffset]) => {
      for (let i = 1; i <= 8; i++) {
        const newFileAsNum = fileAsNum + fileOffset * i;
        const newRank = (currentRank + rankOffset * i) as PositionRank;
        const fileInBounds = newFileAsNum >= 1 && newFileAsNum <= 8;
        const rankInBounds = newRank >= 1 && newRank <= 8;
        if (fileInBounds && rankInBounds) {
          const file = Position.numberToFile(newFileAsNum);
          const newPosition = new Position(file, newRank);
          if (this.canMoveTo(newPosition, board)) moves.push(newPosition);
        } else break;
      }
    });
    return moves;
  }
  moveTo(newPosition: Position, board?: ChessBoard) {
    if (this.canMoveTo(newPosition, board)) {
      this.position = newPosition;
    } else {
      throw new Error("Cannot move here");
    }
  }
  public checkEnPassant(board: ChessBoard) {
    const rankForEnPassant = this.pieceColor === "white" ? 5 : 4;
    if (this.currentPosition.currentRank !== rankForEnPassant) return false;
    const lastMove = board.moves.previousMove;
    if (!lastMove) return false;
    const distance = lastMove[0].distanceFrom(lastMove[1]);
    const piece = board.getPieceFromPosition(lastMove[1]);
    if (
      piece?.type === "pawn" &&
      piece?.pieceColor !== this.pieceColor &&
      Math.abs(distance.rank) === 2
    ) {
      return true;
    }
    return false;
  }


  // potential en passant logic
/*if (
    board &&
    this.checkEnPassant(board) &&
    position.currentFile !== this.currentPosition.currentFile
  ) {
    const lastMove = board.moves.previousMove;
    if (!lastMove) return false;
    const lastMoveFile = lastMove[1].currentFile;
    const lastMoveRank = lastMove[1].currentRank;
    if (position.currentFile !== lastMoveFile) return false;
    if (position.currentRank - forward !== lastMoveRank) return false;
    return true;
  }
  if (attemptedCapture) {
    if (!board) throw Error("No board passed");
    const pieceOnCapturingSquare = board.getPieceFromPosition(position);
    if (
      pieceOnCapturingSquare &&
      pieceOnCapturingSquare?.pieceColor !== this.pieceColor
    )
      return true;
    return false;
  }*/

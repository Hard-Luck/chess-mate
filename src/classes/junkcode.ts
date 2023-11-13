/*
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
  */

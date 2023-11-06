import { Move } from "./game";

export default class Moves {
  private lastMove: Move | null;
  private gameMoves: Move[];
  constructor() {
    this.lastMove = null;
    this.gameMoves = [];
  }
  get previousMove(): Move | null {
    return this.lastMove;
  }
  get history() {
    return [...this.gameMoves];
  }
  public addMove(move: Move) {
    this.lastMove = move;
    this.gameMoves.push(move);
  }
}

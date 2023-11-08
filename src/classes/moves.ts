import { Move } from "./game";

export default class Moves {
  private lastMove: Move | null;
  private gameMoves: Move[];
  private turn: number;
  private playerTurn: "white" | "black";
  constructor() {
    this.playerTurn = "white";
    this.lastMove = null;
    this.turn = 1;
    this.gameMoves = [];
  }
  get previousMove(): Move | null {
    return this.lastMove;
  }
  get history() {
    return [...this.gameMoves];
  }
  get turnNumber() {
    return this.turn;
  }
  get playerTurnColor() {
    return this.playerTurn;
  }
  public nextTurn() {
    this.turn++;
  }
  public nextPlayer() {
    this.playerTurn = this.playerTurn === "white" ? "black" : "white";
    if (this.playerTurn === "white") this.nextTurn();
  }
  public addMove(move: Move) {
    this.lastMove = move;
    this.gameMoves.push(move);
  }
}

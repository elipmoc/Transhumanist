import { GamePlayers } from "./gamePlayers";

export class BoardGameTurnRotation {
    private gamePlayers: GamePlayers;
    constructor(gamePlayers: GamePlayers) {
        this.gamePlayers = gamePlayers;
    }
    next() {
        this.gamePlayers.rotateTurn();
    }
}
import { GamePlayer } from "./gamePlayer";

function cmp(a: GamePlayer, b: GamePlayer) {
    if (a.GameState.State.speed > b.GameState.State.speed)
        return 1;
    else if (a.GameState.State.speed < b.GameState.State.speed)
        return -1;
    else {
        return a.PlayerId < b.PlayerId ? 1 : -1
    }
}

export class TurnManager {
    private turnPlayerIdList: Array<number> = [];
    private currentPlayerId: number;
    private players: Array<GamePlayer>;

    get CurrentPlayerId() { return this.currentPlayerId; }

    constructor(players: Array<GamePlayer>) {
        this.players = players;
    }

    //1週分のターンを計算
    private calculate() {
        this.turnPlayerIdList = this.players.sort(cmp).map(x => x.PlayerId);
    }

    nextTurnPlayerId(): number {
        const nextPlayerId = this.turnPlayerIdList.pop();
        if (nextPlayerId == undefined) {
            this.calculate();
            return this.nextTurnPlayerId();
        }
        this.currentPlayerId = nextPlayerId;
        return this.currentPlayerId;
    }

}
import { GamePlayer } from "./gamePlayer";
import { SocketBinder } from "../socketBinder";

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
    private currentTurnPlayerId: SocketBinder.Binder<number>;
    private players: Array<GamePlayer>;
    private turn: SocketBinder.Binder<number>;

    get CurrentPlayerId() { return this.currentTurnPlayerId.Value; }

    constructor(players: Array<GamePlayer>, boardSocketManager: SocketBinder.Namespace) {
        this.turn = new SocketBinder.Binder<number>("turn");
        this.currentTurnPlayerId = new SocketBinder.Binder<number>("currentTurnPlayerId");
        boardSocketManager.addSocketBinder(this.turn, this.currentTurnPlayerId);
        this.players = players;
        this.turn.Value = 0;
        this.currentTurnPlayerId.Value = 0;
    }

    //1週分のターンを計算
    private calculate() {
        this.turnPlayerIdList = this.players.sort(cmp).map(x => x.PlayerId);
        this.turn.Value = this.turn.Value + 1;
    }

    nextTurnPlayerId(): number {
        const nextPlayerId = this.turnPlayerIdList.pop();
        if (nextPlayerId == undefined) {
            this.calculate();
            return this.nextTurnPlayerId();
        }
        this.currentTurnPlayerId.Value = nextPlayerId;
        return this.currentTurnPlayerId.Value;
    }
}
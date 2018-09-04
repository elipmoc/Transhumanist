import { GamePlayer } from "./gamePlayer";
import { SocketBinder } from "./socketBinder";

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
    private turn: SocketBinder<number>;

    get CurrentPlayerId() { return this.currentPlayerId; }

    constructor(players: Array<GamePlayer>, turn: SocketBinder<number>) {
        this.players = players;
        this.turn = turn;
        turn.Value = 0;
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
        this.currentPlayerId = nextPlayerId;
        return this.currentPlayerId;
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.turn.updateAt(socket);
    }

}
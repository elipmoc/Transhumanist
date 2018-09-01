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
    private turn_player_id_list: Array<number> = [];

    //1週分のターンを計算
    calculate(players: Array<GamePlayer>) {
        this.turn_player_id_list = players.sort(cmp).map(x => x.PlayerId);
        return this;
    }

    nextTurnPlayerId() {
        return this.turn_player_id_list.pop();
    }

}
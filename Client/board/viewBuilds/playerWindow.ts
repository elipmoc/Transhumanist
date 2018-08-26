import { BindParams } from "../bindParams";
import { PlayerWindowBase } from "../views/bases/playerWindowBase";
import { ResponseGamePlayerState } from "../../../Share/responseGamePlayerState";
import { SocketBinder } from "../../socketBinder";
import * as playerWindows from "../views/playerWindows";

export function build(bindParams: BindParams) {
    const playerWindowList: PlayerWindowBase[] = [
        new playerWindows.Player1Window(bindParams.queue),
        new playerWindows.Player2Window(bindParams.queue),
        new playerWindows.Player3Window(bindParams.queue),
        new playerWindows.Player4Window(bindParams.queue)
    ];


    for (let i = 0; i < playerWindowList.length; i++) {
        //プレイヤーの状態が更新されたら呼ばれるイベント
        const updateState = (state: ResponseGamePlayerState) => {
            playerWindowList[i].setPlayerName(state.playerName);
            playerWindowList[i].setSpeed(state.speed);
            playerWindowList[i].setResource(state.resource);
            playerWindowList[i].setPositive(state.positive);
            playerWindowList[i].setNegative(state.negative);
            playerWindowList[i].setUncertainty(state.uncertainty);
            playerWindowList[i].setActivityRange(state.activityRange);
            bindParams.stage.update();
        };
        const gamePlayerState = new SocketBinder<ResponseGamePlayerState>("GamePlayerState" + (i + bindParams.playerId) % 4, bindParams.socket);
        gamePlayerState.onUpdate(updateState);
        bindParams.stage.addChild(playerWindowList[i]);
    }
    const gameMasterPlayerId = new SocketBinder<number | null>("gameMasterPlayerId", bindParams.socket);
    gameMasterPlayerId.onUpdate(id => {
        playerWindowList[(4 + id - bindParams.playerId) % 4].visibleGMIcon(true);
        bindParams.stage.update();
    });
}

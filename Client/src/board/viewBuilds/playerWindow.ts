import { BindParams } from "../bindParams";
import { PlayerWindowBase } from "../views/bases/playerWindowBase";
import { ResponseGamePlayerState } from "../../../Share/responseGamePlayerState";
import { SocketBinder } from "../../socketBinder";
import * as playerWindows from "../views/playerWindows";
import { LayerTag } from "../../board";

export function build(bindParams: BindParams) {
    const playerWindowList: PlayerWindowBase[] = [
        new playerWindows.Player1Window(bindParams.imgQueue),
        new playerWindows.Player2Window(bindParams.imgQueue),
        new playerWindows.Player3Window(bindParams.imgQueue),
        new playerWindows.Player4Window(bindParams.imgQueue)
    ];


    for (let i = 0; i < playerWindowList.length; i++) {
        //プレイヤーの状態が更新されたら呼ばれるイベント
        const updateState = (state: ResponseGamePlayerState) => {
            if (state.playerName != "") {
                playerWindowList[i].setPlayerName(state.playerName);
                playerWindowList[i].setSpeed(state.speed);
                playerWindowList[i].setResource(state.resource);
                playerWindowList[i].setPositive(state.positive);
                playerWindowList[i].setNegative(state.negative);
                playerWindowList[i].setUncertainty(state.uncertainty);
                playerWindowList[i].setActivityRange(state.activityRange);
            } else {
                playerWindowList[i].clearState();
            }

            bindParams.layerManager.update();
        };
        const gamePlayerState = new SocketBinder<ResponseGamePlayerState>("GamePlayerState" + (i + bindParams.playerId) % 4, bindParams.socket);
        gamePlayerState.onUpdate(updateState);
        bindParams.layerManager.add(LayerTag.Ui, playerWindowList[i]);
    }
    const currentTurnPlayerId = new SocketBinder<number>("currentTurnPlayerId", bindParams.socket);
    currentTurnPlayerId.onUpdate(id => {
        playerWindowList.forEach(x => x.setMyTurn(false));
        if (id != -1) playerWindowList[(4 + id - bindParams.playerId) % 4].setMyTurn(true);
        bindParams.layerManager.update();
    })
    const gameMasterPlayerId = new SocketBinder<number | null>("gameMasterPlayerId", bindParams.socket);
    gameMasterPlayerId.onUpdate(id => {
        playerWindowList.forEach(x => x.visibleGMIcon(false));
        playerWindowList[(4 + id - bindParams.playerId) % 4].visibleGMIcon(true);
        bindParams.layerManager.update();
    });
}

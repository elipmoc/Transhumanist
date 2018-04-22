import * as view from "./view";
import { PlayerWindowBase } from "./viewBase";
import { PlayerViewState } from "../Share/playerViewState";

export interface BindParams {
    stage: createjs.Stage;
    queue: createjs.LoadQueue;
    socket: SocketIOClient.Socket;
}

//viewを生成してソケットと結びつける関数
export function viewBuilder(bindParams: BindParams) {
    playerWindowBuilder(bindParams);
    turnFinishButtonBuilder(bindParams);
    declareWarButtonBuilder(bindParams);
}

function playerWindowBuilder(bindParams: BindParams) {
    const playerWindowList: PlayerWindowBase[] = [
        new view.Player1Window(bindParams.queue),
        new view.Player2Window(bindParams.queue),
        new view.Player3Window(bindParams.queue),
        new view.Player4Window(bindParams.queue)
    ];

    for (let i = 0; i < playerWindowList.length; i++) {
        //プレイヤーの状態を更新するソケットイベント
        bindParams.socket.on("setPlayerViewState" + (i + 1),
            (data: string) => {
                const playerViewState: PlayerViewState = JSON.parse(data);
                playerWindowList[i].setPlayerName(playerViewState.playerName);
                playerWindowList[i].setSpeed(playerViewState.speed);
                playerWindowList[i].setResource(playerViewState.resource);
                playerWindowList[i].setPositive(playerViewState.positive);
                playerWindowList[i].setNegative(playerViewState.negative);
                playerWindowList[i].setUncertainty(playerViewState.uncertainty);
                playerWindowList[i].setActivityRange(playerViewState.activityRange);
                bindParams.stage.update();
            }
        );
        bindParams.stage.addChild(playerWindowList[i]);
    }
}

function turnFinishButtonBuilder(bindParams: BindParams) {
    const turnFinishButton =
        new view.TurnFinishButton(
            () => bindParams.socket.emit("turnFinishButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(turnFinishButton);
}

function declareWarButtonBuilder(bindParams: BindParams) {
    const declareWarButton =
        new view.DeclareWarButton(
            () => bindParams.socket.emit("declareWarButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(declareWarButton);
}
import * as view from "./view";
import { PlayerWindowBase, PlayerResourceAreaBase, PlayerBuildBase } from "./viewBase";
import { GamePlayerState } from "../Share/gamePlayerState";
import { SelectActionWindow } from "./viewSelectActionWindow";
import { NumberOfActionCard } from "../Share/numberOfActionCard";
import { ResourceKind } from "../Share/resourceKind";
import { SelectResourceData } from "../Share/selectResourceData";
import { SocketBinder } from "./socketBinder";
import { SocketBinderList } from "./socketBinderList";
import { BuildActionKind } from "../Share/buildActionKind";
import { SelectBuildActionData } from "../Share/selectBuildActionData";
import { LogWindow } from "./logWindow";
import { LogMessage, LogMessageType } from "../Share/logMessage";

export interface BindParams {
    stage: createjs.Stage;
    queue: createjs.LoadQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
}

//viewを生成してソケットと結びつける関数
export function viewBuilder(bindParams: BindParams) {
    playerWindowBuilder(bindParams);
    PlayerResourceAreaBuilder(bindParams);
    logWindowBuilder(bindParams);
    PlayerBuildActionAreaBuilder(bindParams);
    turnFinishButtonBuilder(bindParams);
    declareWarButtonBuilder(bindParams);
    selectActionWindowBuilder(bindParams);
}

function playerWindowBuilder(bindParams: BindParams) {
    const playerWindowList: PlayerWindowBase[] = [
        new view.Player1Window(bindParams.queue),
        new view.Player2Window(bindParams.queue),
        new view.Player3Window(bindParams.queue),
        new view.Player4Window(bindParams.queue)
    ];


    for (let i = 0; i < playerWindowList.length; i++) {
        //プレイヤーの状態が更新されたら呼ばれるイベント
        const updateState = (state: GamePlayerState) => {
            playerWindowList[i].setPlayerName(state.playerName);
            playerWindowList[i].setSpeed(state.speed);
            playerWindowList[i].setResource(state.resource);
            playerWindowList[i].setPositive(state.positive);
            playerWindowList[i].setNegative(state.negative);
            playerWindowList[i].setUncertainty(state.uncertainty);
            playerWindowList[i].setActivityRange(state.activityRange);
            bindParams.stage.update();
        };
        const gamePlayerState = new SocketBinder<GamePlayerState>("GamePlayerState" + (i + bindParams.playerId) % 4, bindParams.socket);
        gamePlayerState.onUpdate(updateState);
        bindParams.stage.addChild(playerWindowList[i]);
    }
}

//プレイヤーのリソース欄生成
function PlayerResourceAreaBuilder(bindParams: BindParams) {
    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new view.Player1ResourceArea(bindParams.queue),
        new view.Player2ResourceArea(bindParams.queue),
        new view.Player3ResourceArea(bindParams.queue),
        new view.Player4ResourceArea(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<ResourceKind>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((x, iconId) => playerResourceAreaList[i].setResource(iconId, x, bindParams.queue));
            bindParams.stage.update();
        });
        resourceKindList.onSetAt((iconId: number, x: ResourceKind) => {
            playerResourceAreaList[i].setResource(iconId, x, bindParams.queue);
        });
        bindParams.stage.addChild(playerResourceAreaList[i]);
    }
    playerResourceAreaList[0].onClickIcon((iconId, resourceKind) => {
        const selectResourceData: SelectResourceData = { iconId, resourceKind };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });
}

//プレイヤーの設置アクション欄生成
function PlayerBuildActionAreaBuilder(bindParams: BindParams) {
    const playerBuildActionAreaList: PlayerBuildBase[] = [
        new view.Player1Build(bindParams.queue),
        new view.Player2Build(bindParams.queue),
        new view.Player3Build(bindParams.queue),
        new view.Player4Build(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const buildActionKindList = new SocketBinderList<BuildActionKind>("BuildActionKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        buildActionKindList.onUpdate((list) => {
            list.forEach((x, iconId) => playerBuildActionAreaList[i].setResource(iconId, x, bindParams.queue));
            bindParams.stage.update();
        });
        buildActionKindList.onSetAt((iconId: number, x: BuildActionKind) => {
            playerBuildActionAreaList[i].setResource(iconId, x, bindParams.queue);
        });
        bindParams.stage.addChild(playerBuildActionAreaList[i]);
    }
    playerBuildActionAreaList[0].onClickIcon((iconId, buildActionKind) => {
        const selectBuildActionData: SelectBuildActionData = { iconId, buildActionKind };
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
    });
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

function selectActionWindowBuilder(bindParams: BindParams) {
    const selectActionWindow = new SelectActionWindow(bindParams.queue);
    selectActionWindow.onSelectedLevel(level => bindParams.socket.emit("selectLevel", level));
    bindParams.stage.addChild(selectActionWindow);
    selectActionWindow.visible = false;
    bindParams.socket.on("setSelectActionWindowVisible", (str: string) => {
        const visibleFlag: boolean = JSON.parse(str);
        selectActionWindow.visible = visibleFlag;
        bindParams.stage.update();
    })
    bindParams.socket.on("setNumberOfActionCard", (str: string) => {
        const numberOfActionCardList: NumberOfActionCard[] = JSON.parse(str);
        selectActionWindow.setNumberOfActionCard(numberOfActionCardList);
        bindParams.stage.update();
    })
}

function logWindowBuilder(bindParams: BindParams) {
    const logWindow = new LogWindow(bindParams.queue);
    const logMessageList = new SocketBinderList<LogMessage>("logMessageList", bindParams.socket);
    logMessageList.onUpdate(msgList => {
        msgList.forEach(msg => logWindow.addMessaage(msg));
        bindParams.stage.update();
    });
    logMessageList.onPush(msg => {
        logWindow.addMessaage(msg);
        bindParams.stage.update();
    })
    bindParams.stage.addChild(logWindow);
}
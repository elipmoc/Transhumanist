import * as view from "./view";
import { PlayerWindowBase, PlayerResourceAreaBase, PlayerBuildBase } from "./viewBase";
import { GamePlayerState } from "../../Share/gamePlayerState";
import { SelectActionWindow } from "./selectActionWindow";
import { NumberOfActionCard } from "../../Share/numberOfActionCard";
import { SelectResourceData } from "../../Share/selectResourceData";
import { SocketBinder } from "../socketBinder";
import { SocketBinderList } from "../socketBinderList";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { LogWindow, LogMessage } from "./logWindow";
import { LogMessageForClient, LogMessageType } from "../../Share/logMessageForClient";
import { EventLogWindow } from "./eventLogWindow";
import { EventLogMessageForClient } from "../../Share/eventLogMessageForClient";
import { ActionStorageWindow } from "./actionStorageWindow";
import { SelectDiceWindow, DiceIcon } from "./selectDiceWindow";
import { DiceNumber } from "../../Share/diceNumber";
import { ActionCardUseDecisionWindow, DialogResult } from "./actionCardUseDecisionWindow";
import { ResourceIndex } from "../../Share/Yaml/resourceYamlData";
import { BuildActionIndex } from "../../Share/Yaml/actionCardYamlData";

export interface BindParams {
    stage: createjs.Stage;
    queue: createjs.LoadQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
}

//viewを生成してソケットと結びつける関数
export function viewBuilder(bindParams: BindParams) {
    playerWindowBuilder(bindParams);
    playerResourceAreaBuilder(bindParams);
    logWindowBuilder(bindParams);
    eventLogWindowBuilder(bindParams);
    playerBuildActionAreaBuilder(bindParams);
    actionStorageWindowBuilder(bindParams);
    turnFinishButtonBuilder(bindParams);
    declareWarButtonBuilder(bindParams);
    selectActionWindowBuilder(bindParams);
    selectDiceWindowBuilder(bindParams);
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
function playerResourceAreaBuilder(bindParams: BindParams) {
    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new view.Player1ResourceArea(bindParams.queue),
        new view.Player2ResourceArea(bindParams.queue),
        new view.Player3ResourceArea(bindParams.queue),
        new view.Player4ResourceArea(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<ResourceIndex>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((x, iconId) => playerResourceAreaList[i].setResource(iconId, x, bindParams.queue));
            bindParams.stage.update();
        });
        resourceKindList.onSetAt((iconId: number, x: ResourceIndex) => {
            playerResourceAreaList[i].setResource(iconId, x, bindParams.queue);
        });
        bindParams.stage.addChild(playerResourceAreaList[i]);
    }
    playerResourceAreaList[0].onClickIcon((iconId, resourceIndex) => {
        const selectResourceData: SelectResourceData = { iconId, resourceIndex };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });
}

//プレイヤーの設置アクション欄生成
function playerBuildActionAreaBuilder(bindParams: BindParams) {
    const playerBuildActionAreaList: PlayerBuildBase[] = [
        new view.Player1Build(bindParams.queue),
        new view.Player2Build(bindParams.queue),
        new view.Player3Build(bindParams.queue),
        new view.Player4Build(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const buildActionKindList = new SocketBinderList<BuildActionIndex>("BuildActionKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        buildActionKindList.onUpdate((list) => {
            list.forEach((x, iconId) => playerBuildActionAreaList[i].setResource(iconId, x, bindParams.queue));
            bindParams.stage.update();
        });
        buildActionKindList.onSetAt((iconId: number, x: BuildActionIndex) => {
            playerBuildActionAreaList[i].setResource(iconId, x, bindParams.queue);
        });
        bindParams.stage.addChild(playerBuildActionAreaList[i]);
    }
    playerBuildActionAreaList[0].onClickIcon((iconId, buildActionIndex) => {
        const selectBuildActionData: SelectBuildActionData = { iconId, buildActionIndex };
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

function selectDiceWindowBuilder(bindParams: BindParams) {
    const diceIconList = new SocketBinder<DiceNumber[]>("diceList" + bindParams.playerId, bindParams.socket);
    const selectDiceWindow = new SelectDiceWindow(bindParams.queue);
    selectDiceWindow.onSelectedDise((index: number) => {
        bindParams.socket.emit("selectDice", index);
    });
    diceIconList.onUpdate(diceList => selectDiceWindow.setDiceList(diceList));
    bindParams.stage.addChild(selectDiceWindow);
    selectDiceWindow.visible = false;
}

function logWindowBuilder(bindParams: BindParams) {
    const logWindow = new LogWindow(bindParams.queue);
    const logMessageList = new SocketBinderList<LogMessageForClient>("logMessageList", bindParams.socket);
    logMessageList.onUpdate(msgList => {
        msgList.forEach(msg => logWindow.addMessaage(new LogMessage(msg)));
        bindParams.stage.update();
    });
    logMessageList.onPush(msg => {
        logWindow.addMessaage(new LogMessage(msg));
        bindParams.stage.update();
    })
    bindParams.stage.addChild(logWindow);
}

function eventLogWindowBuilder(bindParams: BindParams) {
    const eventLogWindow = new EventLogWindow(bindParams.queue);
    const eventLogMessage = new SocketBinder<EventLogMessageForClient>("eventLogMessage", bindParams.socket);
    eventLogMessage.onUpdate(msg => {
        eventLogWindow.setMessaage(msg);
        bindParams.stage.update();
    });
    bindParams.stage.addChild(eventLogWindow);
}

function actionStorageWindowBuilder(bindParams: BindParams) {
    const actionStorageWindow = new ActionStorageWindow(bindParams.queue);
    const decision = new ActionCardUseDecisionWindow();
    decision.visible = false;
    decision.onClicked((r) => {
        if (r == DialogResult.Yes) {
            bindParams.socket.emit("useActionCard", decision.SelectedIndex);
        }
        decision.visible = false;
        bindParams.stage.update();
    });
    actionStorageWindow.onSelectedCard((index, name) => {
        decision.SelectedIndex = index;
        decision.setCardName(name);
        decision.visible = true;
        bindParams.stage.update();
    });

    bindParams.stage.addChild(actionStorageWindow);
    bindParams.stage.addChild(decision);
}
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
import { ActionStorageWindow } from "./actionCard/actionStorageWindow";
import { SelectDiceWindow, DiceIcon } from "./selectDiceWindow";
import { DiceNumber } from "../../Share/diceNumber";
import { ActionCardUseDecisionWindow, DialogResult } from "./actionCard/actionCardUseDecisionWindow";
import { ResourceIndex, ResourceName } from "../../Share/Yaml/resourceYamlData";
import { ActionCardName } from "../../Share/Yaml/actionCardYamlData";
import { WarLineControl } from "./warLine";
import { WarPair } from "../../Share/warPair";
import { TopWindowL } from "./topWindowL";
import { OptionWindow } from "./optionWindow";
import * as global from "../boardGlobalData";
import { Yamls } from "../getYaml";
import { ActionCardHover } from "./actionCardHover";
import { ResourceHover } from "./resourceHover";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";

export interface BindParams {
    stage: createjs.Stage;
    queue: createjs.LoadQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
    yamls: Yamls;
}

//viewを生成してソケットと結びつける関数
export function viewBuilder(bindParams: BindParams) {
    warLineBuilder(bindParams);
    playerWindowBuilder(bindParams);
    const resourceHover = new ResourceHover(null, bindParams.queue);
    playerResourceAreaBuilder(resourceHover, bindParams);
    logWindowBuilder(bindParams);
    eventLogWindowBuilder(bindParams);
    const actionCardHover = new ActionCardHover(bindParams.yamls.resourceHash, bindParams.queue, 3);
    playerBuildActionAreaBuilder(actionCardHover, bindParams);
    actionStorageWindowBuilder(actionCardHover, bindParams);
    bindParams.stage.addChild(actionCardHover);
    bindParams.stage.addChild(resourceHover);
    turnFinishButtonBuilder(bindParams);
    declareWarButtonBuilder(bindParams);
    selectActionWindowBuilder(bindParams);
    selectDiceWindowBuilder(bindParams);
    topWindowLBuilder(bindParams);
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
    new SocketBinder<number | null>("gameMasterPlayerId", bindParams.socket).onUpdate(x => console.log(`gameMasterPlayerId:${x}`));
}

//プレイヤーのリソース欄生成
function playerResourceAreaBuilder(resourceHover: ResourceHover, bindParams: BindParams) {
    bindParams.stage.addChild(resourceHover);
    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new view.Player1ResourceArea(bindParams.queue),
        new view.Player2ResourceArea(bindParams.queue),
        new view.Player3ResourceArea(bindParams.queue),
        new view.Player4ResourceArea(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<ResourceName>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((resourceName, iconId) =>
                playerResourceAreaList[i].setResource(
                    iconId,
                    resourceName,
                    bindParams.yamls.resourceHash[resourceName].index,
                    bindParams.queue));
            bindParams.stage.update();
        });
        resourceKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
            playerResourceAreaList[i].setResource(
                iconId,
                resourceName,
                bindParams.yamls.resourceHash[resourceName].index,
                bindParams.queue);
        });
        bindParams.stage.addChild(playerResourceAreaList[i]);
        playerResourceAreaList[i].onMouseOveredIcon(cardName => {
            resourceHover.visible = true;
            resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.queue);
            bindParams.stage.update();
        });
        playerResourceAreaList[i].onMouseOutedIcon(() => {
            resourceHover.visible = false;
            resourceHover.setYamlData(null, bindParams.queue);
            bindParams.stage.update();
        });
    }
    playerResourceAreaList[0].onClickIcon((iconId, resourceName) => {
        const selectResourceData: SelectResourceData = { iconId };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });
}

//プレイヤーの設置アクション欄生成
function playerBuildActionAreaBuilder(actionCardHover: ActionCardHover, bindParams: BindParams) {
    const playerBuildActionAreaList: PlayerBuildBase[] = [
        new view.Player1Build(bindParams.queue),
        new view.Player2Build(bindParams.queue),
        new view.Player3Build(bindParams.queue),
        new view.Player4Build(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const buildActionKindList = new SocketBinderList<ActionCardName>("BuildActionKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        buildActionKindList.onUpdate((list) => {
            list.forEach((cardName, iconId) =>
                playerBuildActionAreaList[i].setResource(
                    iconId, cardName,
                    bindParams.yamls.buildActionCardHash[cardName].index,
                    bindParams.queue
                ));
            bindParams.stage.update();
        });
        buildActionKindList.onSetAt((iconId: number, cardName: ActionCardName) => {
            playerBuildActionAreaList[i].setResource(
                iconId, cardName, bindParams.yamls.buildActionCardHash[cardName].index, bindParams.queue);
        });
        bindParams.stage.addChild(playerBuildActionAreaList[i]);
        playerBuildActionAreaList[i].onMouseOveredIcon(cardName => {
            actionCardHover.visible = true;
            actionCardHover.setYamlData(bindParams.yamls.buildActionCardHash[cardName], bindParams.queue);
            bindParams.stage.update();
        });
        playerBuildActionAreaList[i].onMouseOutedIcon(() => {
            actionCardHover.visible = false;
            actionCardHover.setYamlData(null, bindParams.queue);
            bindParams.stage.update();
        });
    }
    playerBuildActionAreaList[0].onClickedIcon((iconId, actionCardName) => {
        const selectBuildActionData: SelectBuildActionData = { iconId };
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
    });
}

//ターン終了ボタン生成
function turnFinishButtonBuilder(bindParams: BindParams) {

    const turnFinishButton =
        new view.TurnFinishButton(
            () => bindParams.socket.emit("turnFinishButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(turnFinishButton);

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    const gameMasterPlayerId = new SocketBinder<number>("gameMasterPlayerId", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        bindParams.stage.update();
        switch (cond) {
            case GamePlayerCondition.Start:
                if (gameMasterPlayerId.Value == bindParams.playerId)
                    turnFinishButton.setText("ゲーム開始");
                else
                    turnFinishButton.setText("");
                break;
            case GamePlayerCondition.MyTurn:
                turnFinishButton.setText("ターン終了");
                break;
            case GamePlayerCondition.Wait:
                turnFinishButton.setText("");
                break;

        }
    })
    gameMasterPlayerId.onUpdate(playerId => {
        bindParams.stage.update();
        if (gamePlayerCondition.Value == GamePlayerCondition.Start && playerId == bindParams.playerId)
            turnFinishButton.setText("ゲーム開始");
        else
            turnFinishButton.setText("");
    })
}

//宣戦布告ボタン生成
function declareWarButtonBuilder(bindParams: BindParams) {
    const declareWarButton =
        new view.DeclareWarButton(
            () => bindParams.socket.emit("declareWarButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(declareWarButton);
}

//ドローするアクションカードのレベル選択ウインドウの生成
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

//ダイス選択ウインドウの生成
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

//ログウインドウの生成
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

//イベントログウインドウの生成
function eventLogWindowBuilder(bindParams: BindParams) {
    const eventLogWindow = new EventLogWindow(bindParams.queue);
    const eventLogMessage = new SocketBinder<EventLogMessageForClient>("eventLogMessage", bindParams.socket);
    eventLogMessage.onUpdate(msg => {
        eventLogWindow.setMessaage(msg);
        bindParams.stage.update();
    });
    bindParams.stage.addChild(eventLogWindow);
}

//手札ウインドウの生成
function actionStorageWindowBuilder(actionCardHover: ActionCardHover, bindParams: BindParams) {
    const actionCardList = new SocketBinderList<ActionCardName | null>("actionCardList" + bindParams.playerId, bindParams.socket);
    const actionStorageWindow = new ActionStorageWindow(actionCardHover, bindParams.queue);
    const decision = new ActionCardUseDecisionWindow();
    actionCardList.onUpdate(list =>
        list.forEach((actionCardName, index) =>
            actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName])
        )
    );
    actionCardList.onSetAt((index, actionCardName) =>
        actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName]));
    decision.visible = false;
    decision.onClicked((r) => {
        if (r == DialogResult.Yes) {
            bindParams.socket.emit("useActionCardIndex", decision.CardIndex);
        }
        decision.visible = false;
        bindParams.stage.update();
    });
    actionStorageWindow.onSelectedCard((index, name) => {
        decision.CardName = name;
        decision.CardIndex = index;
        decision.visible = true;
        bindParams.stage.update();
    });

    bindParams.stage.addChild(actionStorageWindow);
    bindParams.stage.addChild(decision);
}

//戦争ライン表示の生成
function warLineBuilder(bindParams: BindParams) {
    const warPairList = new SocketBinderList<WarPair>("warPairList", bindParams.socket);
    const warLineControl = new WarLineControl();
    warPairList.onUpdate(xs => {
        xs.forEach(x => warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId))
        bindParams.stage.update();
    });
    warPairList.onPush(x => {
        warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId)
        bindParams.stage.update();
    });
    warPairList.onPop(x => {
        warLineControl.deleteWarLine(x.playerId1, x.playerId2)
        bindParams.stage.update();
    });
    bindParams.stage.addChild(warLineControl);
}

//左上のやつ生成
function topWindowLBuilder(bindParams: BindParams) {
    //オプションウインドウ生成
    const optionWindow = new OptionWindow(bindParams.queue);
    optionWindow.x = global.canvasWidth / 2;
    optionWindow.y = global.canvasHeight / 2;
    optionWindow.visible = false;
    bindParams.stage.addChild(optionWindow);

    //左上のやつ生成
    const topWindowL = new TopWindowL(bindParams.queue, optionWindow);
    const turn = new SocketBinder<number>("turn", bindParams.socket);
    turn.onUpdate(x => topWindowL.setTurn(x));
    bindParams.stage.addChild(topWindowL);
}
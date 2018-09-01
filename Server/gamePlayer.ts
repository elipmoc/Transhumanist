import { SocketBinder } from "./socketBinder";
import { ResponseGamePlayerState } from "../Share/responseGamePlayerState";
import { PlayerData } from "./playerData";
import { SocketBinderList } from "./socketBinderList";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceName } from "../Share/Yaml/resourceYamlData";
import { GamePlayerCondition } from "../Share/gamePlayerCondition";
import { ActionCardName, ActionCardYamlData } from "../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../Share/Yaml/startStatusYamlData";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: SocketBinderList<ResourceName>;
    private buildActionList: SocketBinderList<ActionCardName>;
    private diceList: SocketBinder<DiceNumber[]>;
    private actionCardList: SocketBinderList<string | null>;
    private playerCond: SocketBinder<GamePlayerCondition>;
    private isGameMaster: boolean = false;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }
    get IsGameMaster() { return this.isGameMaster; }
    set IsGameMaster(x) { this.isGameMaster = x; }

    get GameState() { return this.state; }

    setAICard(ai: StartStatusYamlData) { this.state.setAICard(ai); }

    setMyTurn() {
        this.playerCond.Value = GamePlayerCondition.MyTurn;
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    constructor(
        playerData: PlayerData,
        playerId: number,
        state: SocketBinder<ResponseGamePlayerState>,
        resourceList: SocketBinderList<ResourceName>,
        buildActionList: SocketBinderList<ActionCardName>,
        diceList: SocketBinder<DiceNumber[]>,
        actionCardList: SocketBinderList<string | null>,
        playerCond: SocketBinder<GamePlayerCondition>
    ) {
        this.diceList = diceList;
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = new GamePlayerState(state, playerData.getName());
        this.resourceList = resourceList;
        this.buildActionList = buildActionList;
        this.actionCardList = actionCardList;
        this.buildActionList.Value = [
            "採掘施設",
            "治療施設",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "核融合炉",
            "ロボット工場",
        ];
        this.resourceList.Value = [
            "人間",
            "人間",
            "人間",
            "人間",
            "人間",
            "聖書",
            "聖書",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "テラフォーミング",
        ];
        actionCardList.Value = [null, null, null, null, null];
        this.playerCond = playerCond;
        playerCond.Value = GamePlayerCondition.Start;

    }

    //ユーザーにsocketBinderの値を送信する
    sendToSocket(socket: SocketIO.Socket) {
        this.state.sendToSocket(socket);
        this.resourceList.updateAt(socket);
        this.buildActionList.updateAt(socket);
        this.diceList.updateAt(socket);
    }

    addSocket(socket: SocketIO.Socket) {
        this.actionCardList.addSocket(socket);
        this.playerCond.addSocket(socket);
    }
    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }
}
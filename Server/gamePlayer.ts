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
import { SocketNamespace } from "./socketBindManager";

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

    get Condition() { return this.playerCond.Value; }

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
        boardSocketManager: SocketNamespace
    ) {
        const state = new SocketBinder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new SocketBinderList<ResourceName>("ResourceKindList" + playerId);
        this.buildActionList = new SocketBinderList<ActionCardName>("BuildActionKindList" + playerId);
        this.diceList = new SocketBinder<DiceNumber[]>("diceList" + playerId);
        this.actionCardList = new SocketBinderList<string | null>("actionCardList" + playerId, true, [`player${playerId}`]);
        this.playerCond = new SocketBinder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        boardSocketManager.addSocketBinder(state, this.resourceList, this.buildActionList, this.diceList, this.actionCardList, this.playerCond);

        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = new GamePlayerState(state, playerData.getName());
        this.buildActionList.Value = [
            "採掘施設", "治療施設", "教会", "教会",
            "教会", "教会", "教会", "教会", "教会",
            "教会", "教会", "教会", "教会", "教会",
            "教会", "教会", "教会", "核融合炉",
            "ロボット工場",
        ];
        this.resourceList.Value = [
            "人間", "人間", "人間", "人間", "人間", "聖書",
            "聖書", "CPU", "CPU", "CPU", "CPU", "CPU",
            "CPU", "CPU", "拡張人間", "拡張人間", "拡張人間",
            "拡張人間", "拡張人間", "拡張人間", "拡張人間",
            "テラフォーミング",
        ];
        this.actionCardList.Value = [null, null, null, null, null];
        this.playerCond.Value = GamePlayerCondition.Start;
    }
    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }
}
import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { PlayerData } from "../playerData";
import { DiceNumber } from "../../Share/diceNumber";
import { ResourceName, GenerateResourceYamlDataArray } from "../../Share/Yaml/resourceYamlData";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";
import { yamlGet } from "../yamlGet";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: SocketBinder.BinderList<ResourceName | null>;
    private buildActionList: SocketBinder.BinderList<ActionCardName>;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private actionCardList: SocketBinder.BinderList<string | null>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
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
        boardSocketManager: SocketBinder.Namespace
    ) {
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new SocketBinder.BinderList<ResourceName | null>("ResourceKindList" + playerId);
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList" + playerId, true, [`player${playerId}`]);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
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
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);

        this.actionCardList.Value = [null, null, null, null, null];
        this.playerCond.Value = GamePlayerCondition.Start;
    }

    setResourceList() {
        this.resourceList.Value.fill("人間", 0, 4);
        const arr = GenerateResourceYamlDataArray(yamlGet("./Resource/Yaml/resource.yaml")).filter((x) =>
            x.level == 2);
        this.resourceList.setAt(4, arr[Math.floor(Math.random() * arr.length)].name);
        this.resourceList.update();
    }

    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }
}
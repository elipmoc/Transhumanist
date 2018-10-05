import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { PlayerData } from "../playerData";
import { DiceNumber } from "../../Share/diceNumber";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";
import { ResourceList } from "./ResourceList";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
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
        this.resourceList.addResource("人間");
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
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList", true, [`player${playerId}`]);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);

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


        this.actionCardList.Value = [null, null, null, null, null];
        const useActionCardIndex = new SocketBinder.EmitReceiveBinder<number>("useActionCardIndex", true, [`player${playerId}`]);
        useActionCardIndex.OnReceive(actionCardIndex => this.actionCardList.setAt(actionCardIndex, null));
        this.playerCond.Value = GamePlayerCondition.Start;
        boardSocketManager.addSocketBinder(state, this.buildActionList, this.diceList, this.actionCardList, this.playerCond, useActionCardIndex);

    }

    setResourceList() {
        this.resourceList.setResourceList();
    }

    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }
}
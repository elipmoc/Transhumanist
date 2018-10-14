import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { PlayerData } from "../playerData";
import { DiceNumber } from "../../Share/diceNumber";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";
import { ResourceList } from "./ResourceList";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private actionCardList: SocketBinder.BinderList<string | null>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private actionCardDrawPhase: SocketBinder.Binder<boolean>;
    private isGameMaster: boolean = false;
    private actionCardStacks: ActionCardStacks;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }
    get IsGameMaster() { return this.isGameMaster; }
    set IsGameMaster(x) { this.isGameMaster = x; }

    get Condition() { return this.playerCond.Value; }

    get GameState() { return this.state; }

    setAICard(ai: StartStatusYamlData) { this.state.setAICard(ai); }

    setMyTurn() {
        if (this.actionCardList.Value.find(x => x == null) === null) {
            this.actionCardDrawPhase.Value = true;
        }
        this.playerCond.Value = GamePlayerCondition.MyTurn;
        this.resourceList.addResource("人間");
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    clear() {
        this.uuid = "";
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
        this.actionCardList.Value = [null, null, null, null, null];
        this.playerCond.Value = GamePlayerCondition.Start;
        this.actionCardDrawPhase.Value = false;
        this.isGameMaster = false;
        this.state.clear();
        this.resourceList.clear();
    }

    constructor(
        playerData: PlayerData,
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList", true, [`player${playerId}`]);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        this.actionCardDrawPhase = new SocketBinder.Binder<boolean>("actionCardDrawPhase", true, [`player${playerId}`]);
        const selectActionCardLevel = new SocketBinder.EmitReceiveBinder<number>("selectActionCardLevel", true, [`player${playerId}`]);
        this.actionCardStacks = actionCardStacks;
        selectActionCardLevel.OnReceive(x => {
            if (this.actionCardDrawPhase.Value) {
                const idx = this.actionCardList.Value.findIndex(x => x == null);
                this.actionCardList.setAt(idx, this.actionCardStacks.draw(x).name);
                this.actionCardDrawPhase.Value = false;
            }
        });

        this.actionCardDrawPhase.Value = false;
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = new GamePlayerState(state, playerData.getName());
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
        this.actionCardList.Value = [null, null, null, null, null];
        const useActionCardIndex = new SocketBinder.EmitReceiveBinder<number>("useActionCardIndex", true, [`player${playerId}`]);
        useActionCardIndex.OnReceive(actionCardIndex => {
            const useActionCardName = this.actionCardList.Value[actionCardIndex];
            if (useActionCardName) {
                const useActionCard = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), true)[useActionCardName];
                if (useActionCard) {
                    const idx = this.buildActionList.Value.findIndex(x => x == null);
                    if (idx != -1)
                        this.buildActionList.setAt(idx, useActionCardName);
                }
            }
            this.actionCardList.setAt(actionCardIndex, null);
        });
        this.playerCond.Value = GamePlayerCondition.Start;
        boardSocketManager.addSocketBinder(
            state, this.buildActionList,
            this.diceList, this.actionCardList,
            this.playerCond, useActionCardIndex,
            this.actionCardDrawPhase, selectActionCardLevel);
        state.update();

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
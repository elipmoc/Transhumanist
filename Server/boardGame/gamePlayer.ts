import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { PlayerData } from "../playerData";
import { DiceNumber } from "../../Share/diceNumber";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";
import { ResourceList } from "./ResourceList";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { PlayerActionCard } from "./playerActionCard";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private isGameMaster: boolean = false;
    private actionCard: PlayerActionCard;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }
    get IsGameMaster() { return this.isGameMaster; }
    set IsGameMaster(x) { this.isGameMaster = x; }

    get Condition() { return this.playerCond.Value; }

    get GameState() { return this.state; }

    setAICard(ai: StartStatusYamlData) { this.state.setAICard(ai); }

    setMyTurn() {
        this.actionCard.set_drawPhase();
        this.playerCond.Value = GamePlayerCondition.MyTurn;
        this.resourceList.addResource("人間");
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    clear() {
        this.uuid = "";
        this.playerCond.Value = GamePlayerCondition.Start;
        this.isGameMaster = false;
        this.state.clear();
        this.resourceList.clear();
        this.actionCard.clear();
    }

    constructor(
        playerData: PlayerData,
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        this.actionCard = new PlayerActionCard(playerId, actionCardStacks, boardSocketManager);
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = new GamePlayerState(state, playerData.getName());

        this.playerCond.Value = GamePlayerCondition.Start;
        boardSocketManager.addSocketBinder(
            state,
            this.diceList,
            this.playerCond);
        state.update();

    }

    setResourceList() {
        this.resourceList.setResourceList();
    }

    drawActionCard(card: ActionCardYamlData) {
        this.actionCard.drawActionCard(card);
    }
}
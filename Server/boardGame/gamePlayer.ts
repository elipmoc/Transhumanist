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
import { diceRoll } from "./dice";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private isGameMaster: boolean = false;
    private actionCard: PlayerActionCard;
    private warFlag: boolean = false;

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
        if (this.warFlag)
            this.state.warStateChange();
        this.diceRoll();
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    clear() {
        this.uuid = "";
        this.playerCond.Value = GamePlayerCondition.Empty;
        this.isGameMaster = false;
        this.state.clear();
        this.resourceList.clear();
        this.actionCard.clear();
        this.diceList.Value = [];
    }

    winWar() { this.state.winWar(); this.warFlag = false; }
    loseWar() { this.state.loseWar(); this.warFlag = false; }
    startWar() { this.warFlag = true; }

    constructor(
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        this.actionCard = new PlayerActionCard(playerId, actionCardStacks, boardSocketManager);
        const selectDice = new SocketBinder.EmitReceiveBinder<Number>("selectDice", true, [`player${playerId}`]);
        selectDice.OnReceive(diceIndex => {
            this.playerCond.Value = GamePlayerCondition.MyTurn;
            console.log(`diceIndex:${diceIndex}`)
        });
        this.diceList.Value = [];
        this.playerId = playerId;
        this.uuid = "";
        this.state = new GamePlayerState(state);

        this.playerCond.Value = GamePlayerCondition.Empty;
        boardSocketManager.addSocketBinder(
            state,
            this.diceList,
            this.playerCond,
            selectDice
        );
        state.update();

    }

    setPlayer(playerData: PlayerData) {
        this.state.setPlayerName(playerData.getName());
        this.uuid = playerData.getUuid();
        this.playerCond.Value = GamePlayerCondition.Start;
    }

    setResourceList() {
        this.resourceList.setResourceList();
    }

    drawActionCard(card: ActionCardYamlData) {
        this.actionCard.drawActionCard(card);
    }

    diceRoll() {
        this.diceList.Value = new Array(this.state.State.uncertainty).fill(0).map(() => diceRoll());
        this.playerCond.Value = GamePlayerCondition.Dice;
    }

}
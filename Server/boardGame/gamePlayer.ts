import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { PlayerData } from "../playerData";
import { DiceNumber } from "../../Share/diceNumber";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { UnavailableState } from "../../Share/unavailableState";
import { SocketBinder } from "../socketBinder";
import { ResourceList } from "./ResourceList";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { PlayerActionCard } from "./playerActionCard";
import { diceRoll } from "./dice";
import { CandidateResources } from "../../Share/candidateResources";
import { Event } from "../../Share/Yaml/eventYamlData";
import { BuildActionList } from "./buildActionList";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private isGameMaster = false;
    private actionCard: PlayerActionCard;
    private warFlag = false;
    private buildActionList: BuildActionList;
    //一度だけアクションカードをノーコストで使用できるようにするフラグ
    private onceNoCostFlag = false;
    //人間を使用できなくするフラグ
    private noUseHumanFlag = false;

    private turnFinishButtonClickCallback: () => void;
    onTurnFinishButtonClick(f: () => void) {
        this.turnFinishButtonClickCallback = f;
    }

    reset() {
        this.state.reset();
        this.warFlag = false;
        this.playerCond.Value = GamePlayerCondition.Start;
        this.actionCard.clear();
        this.resourceList.clear();
    }

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }
    get IsGameMaster() { return this.isGameMaster; }
    set IsGameMaster(x) { this.isGameMaster = x; }

    get Condition() { return this.playerCond.Value; }

    get GameState() { return this.state; }

    setAICard(ai: StartStatusYamlData) { this.state.setAICard(ai); }

    setMyTurn(eventCard: Event) {
        this.actionCard.set_drawPhase();
        this.onceNoCostFlag = ["技術革新", "産業革命"].includes(eventCard.name);
        this.noUseHumanFlag = "ニート化が進む" == eventCard.name;
        this.playerCond.Value = GamePlayerCondition.MyTurn;
        if (eventCard.name == "人口爆発") {
            const len = this.resourceList.getCount("人間");
            this.resourceList.addResource("人間", len);
        }
        else if (eventCard.name != "少子化")
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
        this.buildActionList.clear();
    }

    winWar() { this.state.winWar(); this.warFlag = false; }
    loseWar() { this.state.loseWar(); this.warFlag = false; }
    startWar() { this.warFlag = true; }

    constructor(
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        //とりあえず表示すべきものが来たとする。
        const serverData = {
            number: 3,
            resource_names: ["人間", "メタル", "ガス", "ケイ素", "硫黄", "人間"]
        };
        const candidateResources = new SocketBinder.Binder<CandidateResources>("candidateResources" + playerId);
        setTimeout(() => { candidateResources.Value = serverData }, 4000);
        const selectedGetResourceId = new SocketBinder.EmitReceiveBinder<number>("selectedGetResourceId" + playerId);
        selectedGetResourceId.OnReceive(id => {
            this.resourceList.addResource(serverData.resource_names[id])
        });
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        this.actionCard = new PlayerActionCard(playerId, actionCardStacks, boardSocketManager);
        const selectDice = new SocketBinder.EmitReceiveBinder<Number>("selectDice", true, [`player${playerId}`]);
        const turnFinishButtonClick =
            new SocketBinder.EmitReceiveBinder("turnFinishButtonClick", true, [`player${playerId}`]);
        turnFinishButtonClick.OnReceive(() => {
            this.turnFinishButtonClickCallback();
        });

        selectDice.OnReceive(diceIndex => {
            this.playerCond.Value = GamePlayerCondition.MyTurn;
            console.log(`diceIndex:${diceIndex}`)
        });
        this.diceList.Value = [];
        this.playerId = playerId;
        this.uuid = "";
        this.state = new GamePlayerState(state);

        this.playerCond.Value = GamePlayerCondition.Empty;
        this.buildActionList = new BuildActionList(boardSocketManager, playerId);
        const unavailable = new SocketBinder.TriggerBinder<void, UnavailableState>("Unavailable", true, [`player${playerId}`]);

        //アクションカードの使用処理
        this.actionCard.onUseActionCard(
            card => {
                if (this.noUseHumanFlag && this.state.State.negative >= 2 && card.cost.find(x => x.name == "人間")) {
                    unavailable.emit(UnavailableState.Event);
                    return false;
                }
                if (this.onceNoCostFlag == false && this.resourceList.costPayment(card.cost) == false) {
                    unavailable.emit(UnavailableState.Cost);
                    return false;
                }
                if (card.war_use && this.warFlag == false) {
                    unavailable.emit(UnavailableState.War);
                    return false;
                }
                if (card.build_use)
                    this.buildActionList.addBuildAction(card.name);
                if (this.onceNoCostFlag)
                    this.onceNoCostFlag = false;
                return true;
            }
        );
        //設置アクションカードの使用
        this.buildActionList.onUseBuildActionCard(card => {

        });
        boardSocketManager.addSocketBinder(
            state, this.diceList, unavailable,
            this.playerCond, selectDice, candidateResources,
            turnFinishButtonClick, selectedGetResourceId);
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
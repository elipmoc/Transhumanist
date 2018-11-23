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
import { SelectedGetResourceId } from "../../Share/selectedGetResourceId";
import { Event } from "../../Share/Yaml/eventYamlData";
import { BuildActionList } from "./buildActionList";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private diceList: SocketBinder.Binder<DiceNumber[]>;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private candidateResources: SocketBinder.Binder<CandidateResources>;
    private beforeCond: number;
    private isGameMaster = false;
    private actionCard: PlayerActionCard;
    private warFlag = false;
    private buildActionList: BuildActionList;
    //一度だけアクションカードをノーコストで使用できるようにするフラグ
    private onceNoCostFlag = false;
    //人間を使用できなくするフラグ
    private noUseHumanFlag = false;
    //現在のイベント名
    private nowEvent: Event;
    
    //亡命する人の数
    private exileNumber: number;

    //イベントのクリア関数
    private eventClearCallback: () => void;
    onEventClearCallback(f: () => void) {
        this.eventClearCallback = f;
    }
    //亡命処理のコールバック
    private exileCallback: (num: number) => void;
    onExileCallback(f: (num: number) => void) {
        this.exileCallback = f;
    }

    //設置アクションカードを使用できなくするフラグ
    private noUseBuildActionFlag = false;
    //世界大戦の開幕が起きてる時のフラグ
    private noLimitUseWarActionFlag = false;

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
    get ExileNumber() { return this.exileNumber; }
    get Condition() { return this.playerCond.Value; }

    get GameState() { return this.state; }

    setAICard(ai: StartStatusYamlData) { this.state.setAICard(ai); }

    setMyTurn(eventCard: Event) {
        this.actionCard.set_drawPhase();
        this.noLimitUseWarActionFlag = "世界大戦の開幕" == eventCard.name;
        this.noUseBuildActionFlag = "太陽風" == eventCard.name;
        this.onceNoCostFlag = ["技術革新", "産業革命"].includes(eventCard.name);
        this.noUseHumanFlag = "ニート化が進む" == eventCard.name;
        this.playerCond.Value = GamePlayerCondition.MyTurn;
        if (eventCard.name == "人口爆発") {
            const len = this.resourceList.getCount("人間");
            this.resourceList.addResource("人間", len);
        }
        else if (eventCard.name != "少子化")
            this.resourceList.addResource("人間");
        
        if (eventCard.name == "AIへの反抗") {
            this.state.temporarilyActivityRangeSet(this.state.State.negative * -1);
        }
        if (eventCard.name == "AIへの友好") {
            this.state.temporarilyActivityRangeSet(this.state.State.positive);
        }

        if (this.warFlag)
            this.state.warStateChange();
        this.diceRoll();
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    setEvent(eventCard: Event) {
        this.playerCond.Value = GamePlayerCondition.Event;
        this.nowEvent = eventCard;

        switch(this.nowEvent.name){
            case "ムーアの法則":
                this.diceRoll();
                break;
            case "地震":
                this.diceRoll();
                break;
            case "暴風":
                this.diceRoll();
                break;
            case "未知の病気":
                this.diceRoll();
                break;
            case "サブカルチャー":
                this.state.addNegative(-1);
                this.eventClearCallback();
                break;
            case "隕石":
                this.diceRoll();
                break;
            case "亡命":
                if (this.state.State.negative >= 3) {
                    if (this.resourceList.getCount("人間") >= 3) {
                        this.exileNumber = 3;
                    }
                    else {
                        this.exileNumber = this.resourceList.getCount("人間");
                    }    
                    this.resourceList.deleteRequest(this.exileNumber, "人間");
                    this.diceRoll();
                }
                break;
            case "天変地異":
                this.diceRoll();
                break;
            case "独立傾向":
                if (this.resourceList.getCount("ロボット") >= 1) {
                    this.diceRoll();
                }
                else this.eventClearCallback();
                break;
            case "内乱":
                if (this.state.State.negative >= 6) {
                    //任意の設置済みアクションカードを2つ選択して削除
                    this.buildActionList.setNowEvent(true);
                    this.buildActionList.deleteRequest(2,"内乱の効果が適用されました。");
                }
                break;
            case "ブラックホール":
                this.resourceList.randomDeleteResource(1);
                this.eventClearCallback();
                break;

            default:
                this.eventClearCallback();
                break;
        }
    }
    diceSelectAfterEvent(diceNumber:number) {
        switch (this.nowEvent.name) {
            case "ムーアの法則":
                let data = {
                    number: diceNumber,
                    resource_names: this.nowEvent.resources!
                };
                this.candidateResources.Value = data;
                break;
            case "地震":
                this.resourceList.deleteResource("人間", diceNumber);
                this.eventClearCallback();
                break;
            case "暴風":
                if (diceNumber != 3) {
                    //消すリソースを1つ選択してください
                    this.resourceList.setNowEvent(true);
                    this.resourceList.deleteRequest(1, "暴風の効果が適用されました。");
                }
                break;
            case "未知の病気":
                let humanNum = diceNumber;
                if (diceNumber > this.resourceList.getCount("人間")) humanNum = this.resourceList.getCount("人間");
                this.resourceList.changeResource("人間", "病人", humanNum);
                this.eventClearCallback();
                break;
            case "隕石":
                this.resourceList.randomDeleteResource(diceNumber);
                this.eventClearCallback();
                break;
            case "亡命":
                //サイコロの値分、左にずれた人に人間を３つ移動。リソース上限は有効。
                this.exileCallback(diceNumber);
                this.eventClearCallback();
                break;
            case "天変地異":
                //サイコロの値分、リソースと設置済みを消す。
                this.resourceList.randomDeleteResource(diceNumber);
                this.buildActionList.randomDeleteResource(diceNumber);
                this.eventClearCallback();
                break;
            case "独立傾向":
                let robotNum = diceNumber;
                if (diceNumber > this.resourceList.getCount("ロボット")) robotNum = this.resourceList.getCount("ロボット");
                this.resourceList.changeResource("ロボット", "人間", robotNum);
                this.eventClearCallback();
                break;
        }
    }
    resourceSelectAfterEvent(data: SelectedGetResourceId) {
        if (this.nowEvent.name == "ムーアの法則") {
            this.resourceList.addResource(this.nowEvent.resources![data.id]);
            if (data.allSelected) {
                this.eventClearCallback();
            }
        }
    }
    setEventClear() {
        this.playerCond.Value = GamePlayerCondition.EventClear;
    }

    //移民
    addExileResource(num:number) {
        this.resourceList.addResource("人間", num);
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
        this.candidateResources = new SocketBinder.Binder<CandidateResources>("candidateResources" + playerId);
        const selectedGetResourceId = new SocketBinder.EmitReceiveBinder<SelectedGetResourceId>("selectedGetResourceId" + playerId);
        const state = new SocketBinder.Binder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.resourceList.onEventClearCallback(() => {
            this.eventClearCallback;
            this.resourceList.setNowEvent(false);
        });
        this.diceList = new SocketBinder.Binder<DiceNumber[]>("diceList" + playerId);
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>("gamePlayerCondition", true, [`player${playerId}`]);
        this.actionCard = new PlayerActionCard(playerId, actionCardStacks, boardSocketManager);
        const selectDice = new SocketBinder.EmitReceiveBinder<number>("selectDice", true, [`player${playerId}`]);
        const turnFinishButtonClick =
            new SocketBinder.EmitReceiveBinder("turnFinishButtonClick", true, [`player${playerId}`]);
        
        //ターン終了ボタンがクリックされた
        turnFinishButtonClick.OnReceive(() => {
            if (["AIへの反抗","AIへの友好"].includes(this.nowEvent.name)) this.state.temporarilyReset();
            this.turnFinishButtonClickCallback();
        });

        //選択されてリソース追加
        selectedGetResourceId.OnReceive(data => {
            if (this.playerCond.Value == GamePlayerCondition.Event) {
                this.resourceSelectAfterEvent(data)
            }
        });

        //サイコロのダイス選択
        selectDice.OnReceive(diceIndex => {
            this.playerCond.Value = this.beforeCond;
            console.log(`diceIndex:${diceIndex}`);
            if (this.playerCond.Value == GamePlayerCondition.Event) {
                this.diceSelectAfterEvent(this.diceList.Value[diceIndex]);
            }
        });
        this.diceList.Value = [];
        this.playerId = playerId;
        this.uuid = "";
        this.state = new GamePlayerState(state);

        this.playerCond.Value = GamePlayerCondition.Empty;
        this.buildActionList = new BuildActionList(boardSocketManager, playerId);
        this.buildActionList.onEventClearCallback(() => {
            this.eventClearCallback;
            this.buildActionList.setNowEvent(false);
        });
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
                if (
                    card.war_use
                    && this.warFlag == false
                    && (this.noLimitUseWarActionFlag && this.state.State.negative >= 1) == false
                ) {
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
            if (this.noUseBuildActionFlag)
                unavailable.emit(UnavailableState.Event);
        });
        boardSocketManager.addSocketBinder(
            state, this.diceList, unavailable,
            this.playerCond, selectDice, this.candidateResources,
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
        this.beforeCond = this.playerCond.Value;
        this.playerCond.Value = GamePlayerCondition.Dice;
    }
}
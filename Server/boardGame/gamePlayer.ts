import { PlayerData } from "../playerData";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardYamlData, CreateGet, Trade, RandGet, Get } from "../../Share/Yaml/actionCardYamlData";
import { ActionCardName } from "../../Share/Yaml/actionCardYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { UnavailableState } from "../../Share/unavailableState";
import { SocketBinder } from "../socketBinder";
import { ResourceList } from "./ResourceList";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { PlayerActionCard } from "./playerActionCard";
import { Dice } from "./dice";
import { CandidateResources } from "../../Share/candidateResources";
import { SelectedGetResourceId } from "../../Share/selectedGetResourceId";
import { Event } from "../../Share/Yaml/eventYamlData";
import { BuildActionList } from "./buildActionList";
import { War, WarSuccessFlag } from "./war";
import { useActionCard, UseActionResult } from "./useActionCard/useActionCard";
import { setEvent, diceSelectAfterEvent } from "./eventExec";
import { warActionCardExec } from "./useActionCard/warActionCardExec";
import { create } from "domain";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private dice: Dice;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private candidateResources: SocketBinder.Binder<CandidateResources>;
    private beforeCond: number;
    private isGameMaster = false;
    private actionCard: PlayerActionCard;
    private war: War;
    private buildActionList: BuildActionList;
    //一度だけアクションカードをノーコストで使用できるようにするフラグ
    private onceNoCostFlag = false;

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
    //プレイヤーが戦争を始めようとした時に呼ばれるコールバック
    private startWarCallback: (targetPlayerId: number) => WarSuccessFlag;
    onStartWar(f: (targetPlayerId: number) => WarSuccessFlag) {
        this.startWarCallback = f;
    }
    //プレイヤーが戦争を降伏しようとした時に呼ばれるコールバック
    private surrenderCallback: () => WarSuccessFlag;
    onSurrender(f: () => WarSuccessFlag) {
        this.surrenderCallback = f;
    }

    //戦争アクション起動時のコールバック
    private warActionCallback: (cardName: string) => void;
    onWarActionCallback(f: (cardName: string) => void) {
        this.warActionCallback = f;
    }

    private turnFinishButtonClickCallback: () => void;
    onTurnFinishButtonClick(f: () => void) {
        this.turnFinishButtonClickCallback = f;
    }

    reset() {
        this.state.reset();
        this.war.reset();
        this.playerCond.Value = GamePlayerCondition.Start;
        this.actionCard.clear();
        this.resourceList.clear();
    }

    get Uuid() {
        return this.uuid;
    }
    get PlayerId() {
        return this.playerId;
    }
    get IsGameMaster() {
        return this.isGameMaster;
    }
    set IsGameMaster(x) {
        this.isGameMaster = x;
    }
    get ExileNumber() {
        return this.exileNumber;
    }
    get Condition() {
        return this.playerCond.Value;
    }

    get GameState() {
        return this.state;
    }

    setAICard(ai: StartStatusYamlData) {
        this.state.setAICard(ai);
    }

    setMyTurn() {
        if (this.nowEvent.name == "人口爆発") {
            const len = this.resourceList.getCount("人間");
            this.resourceList.addResource("人間", len);
        } else if (this.nowEvent.name != "少子化")
            this.resourceList.addResource("人間");

        if (this.war.getWarFlag()) this.state.warStateChange();

        this.state.updateResource(
            this.resourceList.getCount("倉庫")
        );

        this.state.updateSpeed(
            this.resourceList.getCount("量子コンピュータ")
        );

        if (this.actionCard.is_full() == false)
            this.playerCond.Value = GamePlayerCondition.DrawCard;
        else this.playerCond.Value = GamePlayerCondition.MyTurn;
    }

    setWait() {
        this.playerCond.Value = GamePlayerCondition.Wait;
    }

    setEvent(eventCard: Event) {
        this.playerCond.Value = GamePlayerCondition.Event;
        this.nowEvent = eventCard;

        const result = setEvent(
            eventCard,
            this.state,
            this.resourceList,
            this.buildActionList
        );
        this.onceNoCostFlag = result.onceNoCostFlag;
        if (result.diceRollFlag) {
            this.dice.diceRoll(
                eventCard.diceCause!,
                this.state.State.uncertainty
            );
            this.beforeCond = this.playerCond.Value;
            this.playerCond.Value = GamePlayerCondition.Dice;
        }
        if (result.eventClearFlag) this.eventClearCallback();
        this.exileNumber = result.exileNumber;
    }

    private diceSelectAfterEvent(diceNumber: number) {
        const result = diceSelectAfterEvent(
            this.nowEvent,
            diceNumber,
            this.resourceList,
            this.buildActionList
        );
        if (result.candidateResources)
            this.candidateResources.Value = result.candidateResources;
        if (result.exileNum) this.exileCallback(result.exileNum);
        if (result.eventClearFlag) this.eventClearCallback();
    }

    private resourceSelectAfterEvent(data: SelectedGetResourceId) {
        if (this.nowEvent.name == "ムーアの法則") {
            this.resourceList.addResource(this.nowEvent.resources![data.id]);
            if (this.candidateResources.Value.number <= 0) {
                this.eventClearCallback();
            }
        }
    }
    setEventClear() {
        this.playerCond.Value = GamePlayerCondition.EventClear;
    }

    //移民
    addExileResource(num: number) {
        this.resourceList.addResource("人間", num);
    }

    clear() {
        this.uuid = "";
        this.playerCond.Value = GamePlayerCondition.Empty;
        this.isGameMaster = false;
        this.state.clear();
        this.resourceList.clear();
        this.actionCard.clear();
        this.dice.clear();
        this.buildActionList.clear();
        this.war.reset();
    }

    //プレイヤーが戦争に勝利した時の処理
    winWar() {
        this.state.winWar();
        this.war.win();
    }

    warAction(name: ActionCardName) {
        warActionCardExec(name, this.buildActionList, this.resourceList);
    }

    constructor(
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        this.candidateResources = new SocketBinder.Binder<CandidateResources>(
            "candidateResources" + playerId
        );
        this.dice = new Dice(playerId, boardSocketManager);
        const selectedGetResourceId = new SocketBinder.EmitReceiveBinder<
            SelectedGetResourceId
        >("selectedGetResourceId" + playerId);

        this.resourceList = new ResourceList(boardSocketManager, playerId);
        this.resourceList.onEventClearCallback(() => {
            this.eventClearCallback();
            this.resourceList.setNowEvent(false);
        });
        this.war = new War(boardSocketManager, playerId);
        this.war.onStartWar(targetPlayerId => {
            if (this.playerCond.Value == GamePlayerCondition.MyTurn)
                return this.startWarCallback(targetPlayerId);
            return false;
        });
        this.war.onSurrender(() => {
            if (
                this.playerCond.Value == GamePlayerCondition.MyTurn &&
                this.surrenderCallback()
            ) {
                this.state.loseWar();
                return true;
            }
            return false;
        });
        this.playerCond = new SocketBinder.Binder<GamePlayerCondition>(
            "gamePlayerCondition",
            true,
            [`player${playerId}`]
        );
        this.actionCard = new PlayerActionCard(playerId, boardSocketManager);
        this.actionCard.onSelectActionCardLevel(level => {
            this.actionCard.drawActionCard(actionCardStacks.draw(level));
            this.playerCond.Value = GamePlayerCondition.MyTurn;
        });
        this.actionCard.onSelectWinActionCard(cardName => {
            const card = actionCardStacks.drawWinCard(cardName);
            if (card) this.actionCard.drawActionCard(card);
            this.playerCond.Value = GamePlayerCondition.MyTurn;
        });
        const turnFinishButtonClick = new SocketBinder.EmitReceiveBinder(
            "turnFinishButtonClick",
            true,
            [`player${playerId}`]
        );

        //ターン終了ボタンがクリックされた
        turnFinishButtonClick.OnReceive(() => {
            this.turnFinishButtonClickCallback();
        });

        //選択されたリソースの追加
        selectedGetResourceId.OnReceive(data => {
            if (this.playerCond.Value == GamePlayerCondition.Event) {
                this.candidateResources.Value = {
                    number: this.candidateResources.Value.number - 1,
                    resource_names: this.candidateResources.Value.resource_names
                };
                this.resourceSelectAfterEvent(data);
            }
        });

        //サイコロのダイス選択
        this.dice.onSelectDice(diceNumber => {
            this.playerCond.Value = this.beforeCond;
            if (this.playerCond.Value == GamePlayerCondition.Event) {
                this.diceSelectAfterEvent(diceNumber);
            }
        });
        this.playerId = playerId;
        this.uuid = "";
        this.state = new GamePlayerState(playerId, boardSocketManager);

        this.playerCond.Value = GamePlayerCondition.Empty;
        this.buildActionList = new BuildActionList(
            boardSocketManager,
            playerId
        );
        this.buildActionList.onEventClearCallback(() => {
            this.eventClearCallback();
            this.buildActionList.setNowEvent(false);
        });
        const unavailable = new SocketBinder.TriggerBinder<
            void,
            UnavailableState
        >("Unavailable", true, [`player${playerId}`]);

        //アクションカードの使用処理
        this.actionCard.onUseActionCard(card => {
            const result:UseActionResult = useActionCard(
                card,
                this.nowEvent,
                this.state,
                this.onceNoCostFlag,
                this.resourceList,
                this.buildActionList,
                this.war.getWarFlag()
            );
            if (result.unavailableState != null) {
                unavailable.emit(result.unavailableState);
                return false;
            }
            else if (result.warActionFlag) {
                //callback
                this.warActionCallback(result.cardName);
            }
            else if (result.winActionFlag) {
                //クリア処理
            }
            this.onceNoCostFlag = false;
            return true;
        });
        //設置アクションカードの使用
        this.buildActionList.onUseBuildActionCard((card,data) => {
            if (this.nowEvent.name == "太陽風")
                unavailable.emit(UnavailableState.Event);
            console.log(card.name);

            const commandNum = data.selectNum!;
            switch (card.commands[commandNum].kind) {
                case "rand_get":
                    const randData: RandGet = <RandGet>card.commands[commandNum].body;
                    this.resourceList.addResource(randData.items[data.resourceId!].name);
                    break;
                case "create_get":
                    const createData: CreateGet = <CreateGet>card.commands[commandNum].body;
                    if (this.resourceList.canCostPayment(createData.cost)) {
                        this.resourceList.costPayment(createData.cost);
                        createData.get.forEach(elem => {
                            this.resourceList.addResource(elem.name, elem.number); 
                        });
                    } else {
                        unavailable.emit(UnavailableState.Cost);
                    }
                    break;
                case "get":
                    const getData: Get = <Get>card.commands[commandNum].body;
                    this.resourceList.addResource(getData.items[data.resourceId!].name, getData.items[data.resourceId!].number);
                    break;
                case "trade":
                    const tradeData: Trade = <Trade>card.commands[commandNum].body;
                    if (this.resourceList.canCostPayment(tradeData.cost_items)) {
                        this.resourceList.costPayment(tradeData.cost_items);
                        this.resourceList.changeResource(tradeData.from_item.name, tradeData.to_item.name,1);
                    } else {
                        unavailable.emit(UnavailableState.Cost);
                    }
                    break;

            }
        });
        boardSocketManager.addSocketBinder(
            unavailable,
            this.playerCond,
            this.candidateResources,
            turnFinishButtonClick,
            selectedGetResourceId
        );
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
}

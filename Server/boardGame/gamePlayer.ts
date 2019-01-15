import { PlayerData } from "../playerData";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
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
import { PnChangeData } from "../../Share/pnChangeData";
import { ChurchAction } from "../../Share/churchAction";
import { FutureForecastEventData } from "../../Share/futureForecastEventData";
import { MessageSender } from "./message";
import { useBuildActionCard } from "./useActionCard/useBuildActionCard";

type SuccessFlag = boolean;

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: GamePlayerState;
    private resourceList: ResourceList;
    private dice: Dice;
    private playerCond: SocketBinder.Binder<GamePlayerCondition>;
    private candidateResources: SocketBinder.Binder<CandidateResources>;
    private churchAction: SocketBinder.Binder<ChurchAction>;
    private beforeCond: number;
    private isGameMaster = false;
    private actionCard: PlayerActionCard;
    private war: War;
    private buildActionList: BuildActionList;
    //ターン内で降伏をしたかどうか
    private surrenderFlag: boolean;
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

    //ターン終了した時に呼ばれるコールバック
    private turnFinishButtonClickCallback: () => void;
    onTurnFinishButtonClick(f: () => void) {
        this.turnFinishButtonClickCallback = f;
    }

    //勝利した時に呼ばれるコールバック
    private winCallback: () => void;
    onWin(f: () => void) {
        this.winCallback = f;
    }

    //アクションカードを消費した時に呼ばれるコールバック
    private consumeCallBack: (card: ActionCardYamlData) => void;
    onConsume(f: (card: ActionCardYamlData) => void) {
        this.consumeCallBack = f;
    }

    //未来予報装置がイベントを3枚取得する時に呼ばれるコールバック
    private futureForecastGetEventsCallBack: () => Event[];
    onFutureForecastGetEvents(f: () => Event[]) {
        this.futureForecastGetEventsCallBack = f;
    }

    //未来予報装置が組み替えたイベントを3枚送信した時に呼ばれるコールバック
    private futureForecastSwapEventsCallBack: (data: FutureForecastEventData) => SuccessFlag;
    onFutureForecastSwapEvents(f: (data: FutureForecastEventData) => SuccessFlag) {
        this.futureForecastSwapEventsCallBack = f;
    }

    reset() {
        this.surrenderFlag = false;
        this.state.reset();
        this.war.reset();
        this.playerCond.Value = GamePlayerCondition.Start;
        this.actionCard.clear();
        this.resourceList.clear();
        this.buildActionList.clear();
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
        this.surrenderFlag = false;
        this.buildActionList.resetUsed();
        if (this.nowEvent.name == "人口爆発") {
            const len = this.resourceList.getCount("人間");
            this.resourceList.addResource("人間", len);
        } else if (this.nowEvent.name != "少子化")
            this.resourceList.addResource("人間");

        if (this.war.getWarFlag()) this.state.warStateChange();

        //量子コンピュータ反映
        this.state.updateSpeed(
            this.buildActionList.getCount("量子コンピュータ"));

        //核融合炉反映
        this.resourceList.setHaveFusionReactor(this.buildActionList.getCount("核融合炉") >= 1);

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
        this.surrenderFlag = false;
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
    //戦争状態にする
    startWar() {
        this.war.startWar();
    }

    warAction(name: ActionCardName) {
        warActionCardExec(name, this.buildActionList, this.resourceList, this.state);
    }

    //アクションカードを使用した時のログメッセージ送信
    useActionCardMessage(cardName: string, messageSender: MessageSender) {
        messageSender.sendPlayerMessage(`${this.state.State.playerName}が${cardName}を使用しました`, this.playerId);
    }

    constructor(
        playerId: number,
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks,
        messageSender: MessageSender
    ) {
        this.candidateResources = new SocketBinder.Binder<CandidateResources>(
            "candidateResources", true, [`player${playerId}`]
        );
        this.churchAction = new SocketBinder.Binder<ChurchAction>(
            "churchAction", true, [`player${playerId}`]
        );
        const pnChangeData = new SocketBinder.EmitReceiveBinder<PnChangeData>(
            "PnChangeData", true, [`player${playerId}`]
        );
        this.dice = new Dice(playerId, boardSocketManager);
        const selectedGetResourceId = new SocketBinder.EmitReceiveBinder<SelectedGetResourceId>(
            "selectedGetResourceId", true, [`player${playerId}`]
        );

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
                this.surrenderFlag == false &&
                this.surrenderCallback()
            ) {
                this.state.loseWar();
                this.surrenderFlag = true;
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
            if (this.playerCond.Value != GamePlayerCondition.DrawCard) return;
            if ((level == 4 || level == 5) && this.resourceList.getExistLevel(4) == false && this.resourceList.getExistLevel(5) == false) return;
            const card = actionCardStacks.draw(level);
            if (card) this.actionCard.drawActionCard(card);
            if (this.actionCard.is_full())
                this.playerCond.Value = GamePlayerCondition.MyTurn;
        });
        this.actionCard.onSelectWinActionCard(cardName => {
            if (this.playerCond.Value != GamePlayerCondition.DrawCard) return;
            const card = actionCardStacks.drawWinCard(cardName);
            if (card) this.actionCard.drawActionCard(card);
            if (this.actionCard.is_full())
                this.playerCond.Value = GamePlayerCondition.MyTurn;
        });
        const turnFinishButtonClick = new SocketBinder.EmitReceiveBinder(
            "turnFinishButtonClick",
            true,
            [`player${playerId}`]
        );

        //ターン終了ボタンがクリックされた
        turnFinishButtonClick.OnReceive(() => {
            this.churchAction.Value = { maxNum: 0, enable: false };
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

        //リソース数、設置アクション数の制限設定
        this.state.onChangeActivityRange((val) => this.buildActionList.setBuildCapacity(val));
        this.state.onChangeResource((val) => this.resourceList.setResourceCapacity(val));

        //アクションカードの使用処理
        this.actionCard.onUseActionCard(card => {
            if (this.playerCond.Value != GamePlayerCondition.MyTurn) {
                return false;
            }
            const result: UseActionResult = useActionCard(
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
                this.warActionCallback(result.cardName);
            }
            else if (result.winActionFlag) {
                messageSender.sendPlayerMessage(`${card.name}にて、${this.state.State.playerName}が勝利しました！`, playerId);
                this.winCallback();
            }
            if (card.build_use)
                messageSender.sendPlayerMessage(`${this.state.State.playerName}が${card.name}を設置しました`, playerId)
            else {
                this.useActionCardMessage(card.name, messageSender);
                this.consumeCallBack(card);
            }
            this.onceNoCostFlag = false;
            return true;
        });

        //カード破棄の処理
        this.actionCard.onDestructionActionCard(card => {
            if (this.playerCond.Value == GamePlayerCondition.MyTurn) {
                this.consumeCallBack(card);
                return true;
            }
            return false;
        })

        //未来予報装置のイベント送信用
        const futureForecastGetEvents = new SocketBinder.Binder<FutureForecastEventData | undefined>("futureForecastGetEvents", true, ["player" + this.playerId]);
        //未来予報装置の入れ替えたイベント受信用
        const futureForecastSwapEvents = new SocketBinder.EmitReceiveBinder<FutureForecastEventData>("futureForecastSwapEvents", true, ["player" + this.playerId]);
        futureForecastSwapEvents.OnReceive(data => {
            if (this.playerCond.Value != GamePlayerCondition.Action && futureForecastGetEvents.Value != undefined) return;
            if (this.futureForecastSwapEventsCallBack({ eventNameList: data.eventNameList.reverse() })) {
                this.playerCond.Value = GamePlayerCondition.MyTurn;
                futureForecastGetEvents.Value = undefined;
            }
        })

        //設置アクションカードの使用
        this.buildActionList.onUseBuildActionCard((card, data) => {
            if (this.playerCond.Value != GamePlayerCondition.MyTurn) return false;
            const result = useBuildActionCard(
                card, this.state, this.onceNoCostFlag, this.nowEvent, this.futureForecastGetEventsCallBack(), data
                , this.resourceList, this.buildActionList, this.playerCond, this.churchAction, futureForecastGetEvents
            )
            if (result.unavailableState != null) {
                unavailable.emit(result.unavailableState);
                return false;
            }
            this.onceNoCostFlag = false;
            this.useActionCardMessage(card.name, messageSender);
            return result.consumeFlag;
        });

        //教会のPN変動
        pnChangeData.OnReceive((data) => {
            if (this.playerCond.Value != GamePlayerCondition.Action) return;
            if (this.churchAction.Value && this.churchAction.Value.enable) {
                if (data.changeNumber <= this.resourceList.getCount("信者")) {
                    const adConstant = data.adId == 0 ? 1 : -1;
                    if (data.pnId == 0) {
                        this.state.addPositive(data.changeNumber * adConstant);
                    } else {
                        this.state.addNegative(data.changeNumber * adConstant);
                    }
                    this.churchAction.Value = {
                        maxNum: 0,
                        enable: false
                    };
                    this.playerCond.Value = GamePlayerCondition.MyTurn;
                }
            }
        });

        this.buildActionList.onDeleteBuildActionCard(card => {
            if (card.name == "地下シェルター")
                this.resourceList.resetGuard();
            if (card.name == "倉庫")
                this.state.addResource(-10);
            this.consumeCallBack(card);
        });

        boardSocketManager.addSocketBinder(
            unavailable,
            this.playerCond,
            this.candidateResources,
            turnFinishButtonClick,
            selectedGetResourceId,
            pnChangeData,
            this.churchAction, futureForecastGetEvents, futureForecastSwapEvents
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

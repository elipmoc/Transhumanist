import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "../playerData";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { arrayshuffle } from "../../Share/utility";
import { TurnManager } from "./turnManager";
import { SocketBinder } from "../socketBinder";
import { EventCardDrawer } from "./eventCardDrawer";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { LeaveRoom } from "./leaveRoom";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { EmitReceiveBinder } from "../socketBinder/emitReceiveBinder";
import { WarList } from "./warList";
import { MessageSender } from "./message";
import { LogMessageType } from "../../Share/logMessageForClient";

export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder.Binder<number | null>;
    private turnManager: TurnManager;
    private leaveRoomCallback: (player: GamePlayer) => boolean;
    private turnFinishButtonClickCallback: (player: GamePlayer) => void;
    private endGameRequestCallback: () => void;
    private eventCardDrawer: EventCardDrawer;
    private currentPlayerId: number;
    private warList: WarList;
    private messageSender: MessageSender;

    //ゲームを再び開始できるようにステータスをリセットする
    reset() {
        this.getNowPlayers().forEach(x => x.reset());
        this.turnManager.reset();
        this.eventCardDrawer.reset();
        this.warList.reset();
    }

    constructor(
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks,
        messageSender: MessageSender
    ) {
        this.messageSender = messageSender;
        this.gameMasterPlayerId = new SocketBinder.Binder<number | null>(
            "gameMasterPlayerId"
        );
        boardSocketManager.addSocketBinder(this.gameMasterPlayerId);
        this.eventCardDrawer = new EventCardDrawer(boardSocketManager);
        this.turnManager = new TurnManager(boardSocketManager);
        this.warList = new WarList(boardSocketManager);
        new LeaveRoom(boardSocketManager).onLeaveRoom(id =>
            this.leaveRoomCallback(this.gamePlayerList[id])
        );
        for (let i = 0; i < 4; i++) {
            const player = new GamePlayer(
                i,
                boardSocketManager,
                actionCardStacks
            );
            const endGame = new EmitReceiveBinder("gameEnd", true, [
                `player${player.PlayerId}`
            ]);
            endGame.OnReceive(() => {
                if (player.IsGameMaster) this.endGameRequestCallback();
            });
            boardSocketManager.addSocketBinder(endGame);
            player.onTurnFinishButtonClick(() =>
                this.turnFinishButtonClickCallback(player)
            );
            player.onEventClearCallback(() => this.eventClearCheck(player));
            player.onExileCallback(diceNumber =>
                this.exileMove(player, diceNumber)
            );
            player.onStartWar(
                targetPlayerId => {
                    const targetPlayer = this.getNowPlayers().find(x => x.PlayerId == targetPlayerId);
                    if (targetPlayer && this.warList.startWar(player.PlayerId, targetPlayerId)) {
                        targetPlayer.startWar();
                        return true;
                    }
                    return false;
                }
            );
            player.onSurrender(() => {
                const winPlayerId = this.warList.surrender(player.PlayerId);
                if (winPlayerId !== null) {
                    this.gamePlayerList[winPlayerId].winWar();
                    return true;
                }
                return false;
            });
            player.onWarActionCallback((name: string) => {
                this.useWarActionCard(player.PlayerId, name);
            });
            player.onConsume(card => {
                actionCardStacks.throwAway(card);
            })
            player.onWin(() => this.endGameRequestCallback());

            //未来予報装置の処理
            player.onFutureForecastGetEvents(() => this.eventCardDrawer.getEvents());
            player.onFutureForecastSwapEvents(data => this.eventCardDrawer.swapEvents(data));

            this.gamePlayerList.push(player);
        }
    }

    useWarActionCard(playerId: number, cardName: string) {
        const target = this.warList.getWarPlayerId(playerId);
        if (target != null) {
            this.gamePlayerList[target].warAction(cardName);
        }
    }

    exileMove(player: GamePlayer, diceNumber: number) {
        this.gamePlayerList[
            (player.PlayerId + diceNumber) % this.getNowPlayers().length
        ].addExileResource(player.ExileNumber);
    }

    getNowPlayers() {
        return this.gamePlayerList.filter(
            x => x.Condition != GamePlayerCondition.Empty
        );
    }

    onLeaveRoom(f: (player: GamePlayer) => boolean) {
        this.leaveRoomCallback = f;
    }

    onTurnFinishButtonClick(f: (player: GamePlayer) => void) {
        this.turnFinishButtonClickCallback = f;
    }

    onEndGameRequest(f: () => void) {
        this.endGameRequestCallback = f;
    }

    getPlayerCount() {
        return this.getNowPlayers().length;
    }

    getGamePlayer(uuid: string) {
        return this.getNowPlayers().find(x => x.Uuid == uuid);
    }

    addMember(playerData: PlayerData, playerId: number) {
        const player = this.gamePlayerList[playerId];
        player.setPlayer(playerData);
        if (this.gameMasterPlayerId.Value == null) {
            this.gameMasterPlayerId.Value = playerId;
            player.IsGameMaster = true;
        }
        return player;
    }

    initCard(
        startStatusList: StartStatusYamlData[],
        actionCardStacks: ActionCardStacks
    ) {
        arrayshuffle(startStatusList);
        this.getNowPlayers().forEach((x, idx) => {
            x.setAICard(startStatusList[idx]);
            x.drawActionCard(actionCardStacks.draw(1));
            x.drawActionCard(actionCardStacks.drawByCardName("加工施設", 2));
            for (let i = 0; i < 3; i++) {
                x.drawActionCard(
                    actionCardStacks.draw(Math.floor(Math.random() * 2) + 2)
                );
                x.setResourceList();
            }
        });
    }

    initTurnSet() {
        this.turnManager.setPlayers(this.getNowPlayers());
        this.currentPlayerId = this.turnManager.nextPlayer()!.playerId;
        this.eventCardDrawer.draw();
        this.startEvent();
    }

    rotateTurn() {
        const { playerId, turnChanged } = this.turnManager.nextPlayer();
        this.currentPlayerId = playerId;
        if (turnChanged) {
            this.eventCardDrawer.draw();
            this.startEvent();
        } else this.playerTurnSet();
    }

    playerTurnSet() {
        this.getNowPlayers().forEach(player => {
            if (player.PlayerId != this.currentPlayerId) player.setWait();
            else player.setMyTurn();
        });
    }

    eventClearCheck(player: GamePlayer) {
        player.setEventClear();
        if (
            this.getNowPlayers().every(
                x => x.Condition == GamePlayerCondition.EventClear
            )
        )
            this.playerTurnSet();
    }

    private startEvent() {
        this.messageSender.sendMessage(`イベント：${this.eventCardDrawer.NowEvent!.name}が発生しました`, LogMessageType.EventMsg)
        this.getNowPlayers().forEach(player => {
            player.setEvent(this.eventCardDrawer.NowEvent!);
        });
    }
}

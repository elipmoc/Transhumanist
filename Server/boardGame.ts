import { BoardPlayerHandle } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GamePlayers } from "./gamePlayers";
import { SocketBinder } from "./socketBinder";
import { SocketBinderList } from "./socketBinderList";
import { ResponseGamePlayerState } from "../Share/responseGamePlayerState";
import { LogMessageForClient, LogMessageType } from "../Share/logMessageForClient";
import { EventLogMessageForClient } from "../Share/eventLogMessageForClient";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceName } from "../Share/Yaml/resourceYamlData";
import { ActionCardName } from "../Share/Yaml/actionCardYamlData";
import { WarPair } from "../Share/warPair";
import { GamePlayerCondition } from "../Share/gamePlayerCondition";
import { NumberOfActionCard } from "../Share/numberOfActionCard";
import { BoardGameStarter } from "./boardGameStarter";
import { BoardGameStatusChanger } from "./boardGameStatusChanger";
import { ActionCardStacks } from "./Card/actionCardStacks";
import { BoardGameTurnRotation } from "./boardGameTurnRotation";

export class BoardGame {
    private gamePlayers: GamePlayers;
    private boardSocket: SocketIO.Namespace;
    private roomId: number;
    private logMessageList: SocketBinderList<LogMessageForClient>;
    private eventLogMessage: SocketBinder<EventLogMessageForClient>;
    private warPairList: SocketBinderList<WarPair>;
    private actionCardStacks: ActionCardStacks;
    private boardGameStatusChanger: BoardGameStatusChanger;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.boardSocket = boardSocket;
        this.boardGameStatusChanger = new BoardGameStatusChanger();
        let numberOfActionCardList = new SocketBinder<NumberOfActionCard[]>("numberOfActionCard");
        numberOfActionCardList.setNamespaceSocket(this.boardSocket);
        this.actionCardStacks = new ActionCardStacks(numberOfActionCardList);

        const gameMasterPlayerId = new SocketBinder<number | null>("gameMasterPlayerId")
        gameMasterPlayerId.setNamespaceSocket(this.boardSocket);
        const turn = new SocketBinder<number>("turn");
        turn.setNamespaceSocket(this.boardSocket);
        this.gamePlayers = new GamePlayers(gameMasterPlayerId, turn);
        this.roomId = roomId;

        this.warPairList = new SocketBinderList<WarPair>("warPairList");
        this.warPairList.setNamespaceSocket(this.boardSocket);
        setTimeout(() => this.warPairList.Value = [{ playerId1: 0, playerId2: 1 }], 3000);
        this.logMessageList = new SocketBinderList<LogMessageForClient>("logMessageList");
        this.logMessageList.setNamespaceSocket(this.boardSocket);
        this.logMessageList.Value = new Array();
        this.logMessageList.push(new LogMessageForClient("イベント【人口爆発】が発生しました。", LogMessageType.EventMsg));
        this.logMessageList.push(new LogMessageForClient("スターは「工場」を設置しました。", LogMessageType.Player1Msg));
        this.logMessageList.push(new LogMessageForClient("N.Hのターンです。", LogMessageType.Player2Msg));
        this.logMessageList.push(new LogMessageForClient("らいぱん鳥のターンです。", LogMessageType.Player3Msg));
        this.logMessageList.push(new LogMessageForClient("戦争状態のため、Positiveが-1されました", LogMessageType.Player3Msg));
        setTimeout(() => this.logMessageList.push(new LogMessageForClient("ようこそ", LogMessageType.EventMsg)), 5000);
        this.eventLogMessage = new SocketBinder<EventLogMessageForClient>("eventLogMessage");
        this.eventLogMessage.setNamespaceSocket(this.boardSocket);
        this.eventLogMessage.Value = new EventLogMessageForClient("イベント【人口爆発】が発生しました", "リソース欄にある『人間の』2倍の\n新たな『人間』を追加する。\n新たに追加する時、『人間』は削除対象に出来ない。");
    }

    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gamePlayers.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);

            //初期データを送信する
            this.gamePlayers.sendToSocket(socket);
            gamePlayer.addSocket(socket);
            this.logMessageList.updateAt(socket);
            this.eventLogMessage.updateAt(socket);
            this.warPairList.updateAt(socket);
            this.actionCardStacks.updateAt(socket);
            const boardGameStarter = new BoardGameStarter(this.gamePlayers, this.boardGameStatusChanger, this.actionCardStacks);
            const boardGameTurnRotation = new BoardGameTurnRotation(this.gamePlayers);
            new BoardPlayerHandle(socket, gamePlayer, boardGameStarter, boardGameTurnRotation);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        const state = new SocketBinder<ResponseGamePlayerState>("GamePlayerState" + playerId);
        state.setNamespaceSocket(this.boardSocket);
        const resourceList = new SocketBinderList<ResourceName>("ResourceKindList" + playerId);
        resourceList.setNamespaceSocket(this.boardSocket);
        const buildActionList = new SocketBinderList<ActionCardName>("BuildActionKindList" + playerId);
        buildActionList.setNamespaceSocket(this.boardSocket);
        const diceList = new SocketBinder<DiceNumber[]>("diceList" + playerId);
        diceList.setNamespaceSocket(this.boardSocket);
        const actionCardList = new SocketBinderList<string | null>("actionCardList" + playerId);
        const playerCond = new SocketBinder<GamePlayerCondition>("gamePlayerCondition");
        this.gamePlayers.addMember(playerData, playerId, state, resourceList, buildActionList, diceList, actionCardList, playerCond);
    }
}
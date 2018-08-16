import { RoomData } from "./roomData";
import { BoardPlayerHandle, BoardPlayerHandleEvents } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GameMaster } from "./gameMaster";
import { SelectResourceData } from "../Share/selectResourceData";
import { SocketBinder } from "./socketBinder";
import { SocketBinderList } from "./socketBinderList";
import { GamePlayerState } from "../Share/gamePlayerState";
import { SelectBuildActionData } from "../Share/selectBuildActionData";
import { LogMessageForClient, LogMessageType } from "../Share/logMessageForClient";
import { EventLogMessageForClient } from "../Share/eventLogMessageForClient";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceIndex, ResourceName } from "../Share/Yaml/resourceYamlData";
import { BuildActionIndex, ActionCardYamlData, ActionCardName } from "../Share/Yaml/actionCardYamlData";
import { WarPair } from "../Share/warPair";

export class BoardGame {
    private gameMaster: GameMaster;
    private boardSocket: SocketIO.Namespace;
    private roomId: number;
    private logMessageList: SocketBinderList<LogMessageForClient>;
    private eventLogMessage: SocketBinder<EventLogMessageForClient>;
    private warPairList: SocketBinderList<WarPair>;
    private turn: SocketBinder<number>;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.gameMaster = new GameMaster();
        this.boardSocket = boardSocket;
        this.roomId = roomId;
        this.turn = new SocketBinder<number>("turn");
        this.turn.setNamespaceSocket(this.boardSocket);
        this.turn.Value = 5;
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
        const gamePlayer = this.gameMaster.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);
            let handle: BoardPlayerHandle;

            const event: BoardPlayerHandleEvents = {
                turnFinishButtonClickCallBack: () => console.log("turnFinishButtonClick"),
                declareWarButtonClickCallBack: () => console.log("declareWarButtonClick"),
                selectLevelCallBack: (level: number) => {
                    console.log("level" + level);
                    handle.setSelectActionWindowVisible(false);
                    //setTimeout(() => handle.setSelectActionWindowVisible(true), 3000);
                },
                selectResourceCallBack: (data: SelectResourceData) =>
                    console.log(`selectResource player${gamePlayer.PlayerId} iconId${data.iconId}`),
                selectBuildActionCallBack: (data: SelectBuildActionData) =>
                    console.log(`selectBuildAction player${gamePlayer.PlayerId} iconId${data.iconId}`)

            }
            //初期データを送信する
            this.gameMaster.sendToSocket(socket);
            this.logMessageList.updateAt(socket);
            this.eventLogMessage.updateAt(socket);
            this.warPairList.updateAt(socket);
            this.turn.updateAt(socket);
            handle = new BoardPlayerHandle(socket, event);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        const state = new SocketBinder<GamePlayerState>("GamePlayerState" + playerId);
        state.setNamespaceSocket(this.boardSocket);
        const resourceList = new SocketBinderList<ResourceName>("ResourceKindList" + playerId);
        resourceList.setNamespaceSocket(this.boardSocket);
        const buildActionList = new SocketBinderList<ActionCardName>("BuildActionKindList" + playerId);
        buildActionList.setNamespaceSocket(this.boardSocket);
        const diceList = new SocketBinder<DiceNumber[]>("diceList" + playerId);
        diceList.setNamespaceSocket(this.boardSocket);
        const actionCardList = new SocketBinderList<string | null>("actionCardList" + playerId);
        this.gameMaster.addMember(playerData, playerId, state, resourceList, buildActionList, diceList, actionCardList);
    }
}
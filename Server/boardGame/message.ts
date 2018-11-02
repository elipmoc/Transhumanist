import { LogMessageForClient, LogMessageType } from "../../Share/logMessageForClient";
import { SocketBinder } from "../socketBinder";

export class Message {
    private logMessageList: SocketBinder.BinderList<LogMessageForClient>;

    private playerNameList = ["", "", "", ""];

    constructor(boardsocketManager: SocketBinder.Namespace) {
        this.logMessageList = new SocketBinder.BinderList<LogMessageForClient>("logMessageList");
        this.logMessageList.Value = new Array();
        this.logMessageList.push(new LogMessageForClient("イベント【人口爆発】が発生しました。", LogMessageType.EventMsg));
        this.logMessageList.push(new LogMessageForClient("スターは「工場」を設置しました。", LogMessageType.Player1Msg));
        this.logMessageList.push(new LogMessageForClient("N.Hのターンです。", LogMessageType.Player2Msg));
        this.logMessageList.push(new LogMessageForClient("らいぱん鳥のターンです。", LogMessageType.Player3Msg));
        this.logMessageList.push(new LogMessageForClient("戦争状態のため、Positiveが-1されました", LogMessageType.Player3Msg));
        setTimeout(() => this.logMessageList.push(new LogMessageForClient("ようこそ", LogMessageType.EventMsg)), 5000);

        for (var i = 0; i < 4; i++) {
            let sendChatMessage = new SocketBinder.EmitReceiveBinder<string>("sendChatMessage", true, ["player" + i]);
            let ii = i;
            sendChatMessage.OnReceive((str: string) => {
                if (this.chatMessageValidation(str))
                    this.logMessageList.push(
                        new LogMessageForClient(`[${this.playerNameList[ii]}]${str}`, ii + 1));
            });
            boardsocketManager.addSocketBinder(sendChatMessage);
        }
        boardsocketManager.addSocketBinder(this.logMessageList);
    }

    addPlayerName(playerId: number, name: string) {
        this.playerNameList[playerId] = name;
    }

    private chatMessageValidation(str: string) {
        var reg = new RegExp(/[^\s]/g);
        return reg.test(str);
    }
}
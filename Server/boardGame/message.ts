import { LogMessageForClient, LogMessageType } from "../../Share/logMessageForClient";
import { EventLogMessageForClient } from "../../Share/eventLogMessageForClient";
import { SocketBinder } from "../socketBinder";

export class Message {
    private logMessageList: SocketBinder.BinderList<LogMessageForClient>;
    private eventLogMessage: SocketBinder.Binder<EventLogMessageForClient>;
    private sendChatMessage: SocketBinder.EmitReceiveBinder<String>;

    constructor(boardsocketManager: SocketBinder.Namespace) {
        this.logMessageList = new SocketBinder.BinderList<LogMessageForClient>("logMessageList");
        this.logMessageList.Value = new Array();
        this.logMessageList.push(new LogMessageForClient("イベント【人口爆発】が発生しました。", LogMessageType.EventMsg));
        this.logMessageList.push(new LogMessageForClient("スターは「工場」を設置しました。", LogMessageType.Player1Msg));
        this.logMessageList.push(new LogMessageForClient("N.Hのターンです。", LogMessageType.Player2Msg));
        this.logMessageList.push(new LogMessageForClient("らいぱん鳥のターンです。", LogMessageType.Player3Msg));
        this.logMessageList.push(new LogMessageForClient("戦争状態のため、Positiveが-1されました", LogMessageType.Player3Msg));
        setTimeout(() => this.logMessageList.push(new LogMessageForClient("ようこそ", LogMessageType.EventMsg)), 5000);
        this.eventLogMessage = new SocketBinder.Binder<EventLogMessageForClient>("eventLogMessage");
        this.eventLogMessage.Value = new EventLogMessageForClient("イベント【人口爆発】が発生しました", "リソース欄にある『人間の』2倍の\n新たな『人間』を追加する。\n新たに追加する時、『人間』は削除対象に出来ない。");
        this.sendChatMessage = new SocketBinder.EmitReceiveBinder("sendChatMessage");
        this.sendChatMessage.OnReceive((str: string) => this.logMessageList.push(
            new LogMessageForClient(str, LogMessageType.EventMsg)
        ));
        boardsocketManager.addSocketBinder(this.logMessageList, this.eventLogMessage, this.sendChatMessage);
    }
}
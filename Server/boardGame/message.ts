import { LogMessageForClient, LogMessageType } from "../../Share/logMessageForClient";
import { SocketBinder } from "../socketBinder";

export class Message {
    private logMessageList: SocketBinder.BinderList<LogMessageForClient>;

    private playerNameList = ["", "", "", ""];

    constructor(boardsocketManager: SocketBinder.Namespace) {
        this.logMessageList = new SocketBinder.BinderList<LogMessageForClient>("logMessageList");
        this.logMessageList.Value = new Array();

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

    //メッセージ送信
    sendMessage(msg: string, type: LogMessageType) {
        this.logMessageList.push(new LogMessageForClient(msg, type));
    }

    //MessageSenderクラスの作成
    createMessageSender() {
        return new MessageSender(this);
    }

    //ユーザーチャットの不正な文字列の検査
    private chatMessageValidation(str: string) {
        var reg = new RegExp(/[^\s]/g);
        return reg.test(str);
    }
}

//メッセージ送信するだけ用のクラス（基本的にはこれを各オブジェクトに配布して使う）
export class MessageSender {
    private message: Message;
    constructor(message: Message) {
        this.message = message;
    }
    //メッセージ送信
    sendMessage(msg: string, type: LogMessageType) {
        this.message.sendMessage(msg, type);
    }
    //各プレイヤーに関するメッセージ送信
    sendPlayerMessage(msg: string, playerId: number) {
        this.message.sendMessage(msg, playerId + 1);
    }
}
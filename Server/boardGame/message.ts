import { LogMessageForClient, LogMessageType } from "../../Client/Share/logMessageForClient";
import { SocketBinder } from "../socketBinder";



export class Message {
    private logMessageList: LogMessageList;

    private playerNameList = ["", "", "", ""];

    constructor(boardsocketManager: SocketBinder.Namespace) {
        this.logMessageList = new LogMessageList(boardsocketManager);

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

    //CardMessageSenderを生成
    ToCardMessageSender(playerId: number) {
        return new CardMessageSender(this, playerId);
    }
}

//メッセージ送信するだけ用のクラス（基本的にはこれを各オブジェクトに配布して使う）
export class CardMessageSender {
    private messageSender: MessageSender;
    private playerId: number;

    constructor(messageSender: MessageSender, playerId: number) {
        this.messageSender = messageSender;
        this.playerId = playerId;
    }
    //各プレイヤーに関するメッセージ送信
    sendPlayerMessage(msg: string) {
        this.messageSender.sendPlayerMessage(msg, this.playerId);
    }
    //カードを破棄したメッセージを送信
    cardDeleteMessage(cardName: string) {
        this.sendPlayerMessage(`${cardName}を破棄`);
    }
    //カードを消費したメッセージを送信
    cardPaymentMessage(cardName: string) {
        this.sendPlayerMessage(`${cardName}を消費`);
    }
    //カードを置き換えしたメッセージを送信
    cardChangeMessage(cardNameFrom: string, cardNameTo: string) {
        this.sendPlayerMessage(`${cardNameFrom}を${cardNameTo}に置換`);
    }
}

class LogMessageList {
    private static MaxMessageNum: number = 50;
    private logMessageList: SocketBinder.BinderList<LogMessageForClient>;

    constructor(boardsocketManager: SocketBinder.Namespace) {
        this.logMessageList = new SocketBinder.BinderList<LogMessageForClient>("logMessageList");
        this.logMessageList.Value = new Array();
        boardsocketManager.addSocketBinder(this.logMessageList);
    }

    push(data: LogMessageForClient) {
        if (this.logMessageList.Value.length >= 50)
            this.logMessageList.Value.shift();
        this.logMessageList.push(data);
    }
}
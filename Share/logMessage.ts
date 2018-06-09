//ログメッセージタイプ
export const enum LogMessageType {
    EventMsg = 0,
    Player1Msg,
    Player2Msg,
    Player3Msg,
    Player4Msg,
}


export class LogMessage {
    private msg: string;
    private msgType: LogMessageType;

    get Msg() { return this.msg; }
    get MsgType() { return this.msgType; }

    constructor(msg: string, msgType: LogMessageType) {
        this.msg = msg;
        this.msgType = msgType;
    }
}
//ログメッセージタイプ
export const enum LogMessageType {
    EventMsg = 0,
    Player1Msg,
    Player2Msg,
    Player3Msg,
    Player4Msg,
}


export class LogMessage {
    msg: string;
    msgType: LogMessageType;


    constructor(msg: string, msgType: LogMessageType) {
        this.msg = msg;
        this.msgType = msgType;
    }
}
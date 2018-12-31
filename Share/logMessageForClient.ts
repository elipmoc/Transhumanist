//ログメッセージタイプ
export const enum LogMessageType {
    //イベントのメッセージ
    EventMsg = 0,
    //個人の行動に関係するメッセージ
    Player1Msg,
    Player2Msg,
    Player3Msg,
    Player4Msg,
    //全体に関係するメッセージとか
    OtherMsg,
}


export class LogMessageForClient {
    readonly msg: string;
    readonly msgType: LogMessageType;


    constructor(msg: string, msgType: LogMessageType) {
        this.msg = msg;
        this.msgType = msgType;
    }
}
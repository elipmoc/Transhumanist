import { BinderBase } from "./binderBase";

//メッセージをクライアントから受け取るクラス
export class EmitReceiveBinder<T=undefined> implements BinderBase {

    private valueName: string;
    private privateFlag: boolean;
    private privateSocketTags: Array<string>;
    private callback: (t: T) => void;

    constructor(
        valueName: string,
        privateFlag: boolean = false,
        privateSocketTags: string[] = []
    ) {
        this.valueName = valueName;
        this.privateFlag = privateFlag;
        this.privateSocketTags = privateSocketTags;
    }

    get ValueName() {
        return this.valueName;
    }

    OnReceive(callback: (t: T) => void) {
        this.callback = callback;
    }

    setNamespace(namespace: SocketIO.Namespace) { }

    private setReceive(socket: SocketIO.Socket) {
        socket.on(this.valueName, (data) => {
            if (data)
                this.callback(JSON.parse(data));
            else
                this.callback(data);
        });
    }

    connect(tag: string, socket: SocketIO.Socket) {
        if (this.privateFlag == false) {
            this.setReceive(socket);
            return;
        }
        if (this.privateSocketTags.find(x => x == tag) != undefined) {
            this.setReceive(socket);
        }
    }


}
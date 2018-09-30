import { BinderBase } from "./binderBase";

interface SocketHash {
    [index: string]: SocketIO.Socket;
}

//発火、発火の受け取りをするクラス
export class TriggerBinder<R, E> implements BinderBase {
    private privateFlag: boolean;
    private socketList: SocketHash = {};
    private namespaceSocket: SocketIO.Namespace | null = null;
    private privateSocketTags: Array<string>;
    private valueName: string;
    private callback: (t?: R) => void;


    constructor(
        valueName: string,
        privateFlag: boolean = false,
        privateSocketTags: string[] = []
    ) {
        this.valueName = valueName;
        this.privateFlag = privateFlag;
        this.privateSocketTags = privateSocketTags;
    }

    OnReceive(callback: (t?: R) => void) {
        this.callback = callback;
    }

    private setReceive(socket: SocketIO.Socket) {
        socket.on(this.valueName, (data) => {
            if (data)
                this.callback(JSON.parse(data));
            else
                this.callback();
        });
    }

    emit(data?: E) {
        let data2 = JSON.stringify(data);
        if (this.namespaceSocket)
            this.namespaceSocket.emit(this.valueName, data2);
        for (let socket of Object.values(this.socketList)) {
            socket.emit(this.valueName, data2);
        }
    }

    setNamespace(socket: SocketIO.Namespace) {
        if (this.privateFlag == false)
            this.namespaceSocket = socket;
    }
    connect(socketTag: string, socket: SocketIO.Socket) {
        if (this.privateFlag == false) {
            this.setReceive(socket);
            return;
        }
        if (this.privateSocketTags.find(x => x == socketTag) != undefined) {
            this.socketList[socket.id] = socket;
            this.setReceive(socket);
            (<SocketIO.Socket>socket).on("disconnect", () => {
                delete this.socketList[socket.id];
            });
        }
    }


}
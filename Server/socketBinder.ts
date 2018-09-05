import { SocketBinderBase } from "./socketBinderBase";

interface SocketHash {
    [index: string]: SocketIO.Socket;
}


//値をクライアントと効率よくシェアできるクラス
export class SocketBinder<T> implements SocketBinderBase {
    private value: T;
    private socketList: SocketHash = {};
    private namespaceSocket: SocketIO.Namespace | null = null;
    private valueName: string;
    private privateFlag: boolean;
    private privateSocketTags: Array<string>;

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

    get Value() {
        return this.value;
    }

    set Value(value: T) {
        this.value = value;
        this.update();
    }

    protected socketEmit(eventName: string, data: string) {
        if (this.namespaceSocket)
            this.namespaceSocket.emit(eventName, data);
        for (let socket of Object.values(this.socketList)) {
            socket.emit(eventName, data);
        }
    }

    //値を変更したことを手動で伝える
    update() {
        this.socketEmit("update" + this.valueName, JSON.stringify(this.value));
    }

    connect(socketTag: string, socket: SocketIO.Socket) {
        if (this.privateFlag == false) {
            this.updateAt(socket);
            return;
        }
        if (this.privateSocketTags.find(x => x == socketTag) != undefined) {
            this.socketList[socket.id] = socket;
            (<SocketIO.Socket>socket).on("disconnect", () => {
                delete this.socketList[socket.id];
            });
            this.updateAt(socket);
        }
    }

    //値を変更したことを個別のsocketを指定して手動で伝える
    private updateAt(socket: SocketIO.Socket) {
        socket.emit("update" + this.valueName, JSON.stringify(this.value));
    }

    setNamespace(socket: SocketIO.Namespace) {
        if (this.privateFlag == false)
            this.namespaceSocket = socket;
    }
}
interface SocketHash {
    [index: string]: SocketIO.Socket;
}


//値をクライアントと効率よくシェアできるクラス
export class SocketBinder<T>{
    private value: T;
    private socketList: SocketHash = {};
    private namespaceSocket: SocketIO.Namespace | null = null;
    private valueName: string;

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

    //値を変更したことを個別のsocketを指定して手動で伝える
    updateAt(socket: SocketIO.Socket) {
        socket.emit("update" + this.valueName, JSON.stringify(this.value));
    }

    addSocket(socket: SocketIO.Socket) {
        this.socketList[socket.id] = socket;
        (<SocketIO.Socket>socket).on("disconnect", () => {
            delete this.socketList[socket.id];
        });
        this.updateAt(socket);
    }

    setNamespaceSocket(socket: SocketIO.Namespace) {
        this.namespaceSocket = socket;
    }

    constructor(
        valueName: string) {
        this.valueName = valueName;
    }
}
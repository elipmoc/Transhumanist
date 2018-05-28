
//値をクライアントと効率よくシェアできるクラス
export class SocketBinder<T>{
    private value: T;
    protected socket: SocketIO.Namespace;
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

    //値を変更したことを手動で伝える
    update() {
        this.socket.emit("update" + this.valueName, JSON.stringify(this.value));
    }

    //値を変更したことを個別のsocketを指定して手動で伝える
    updateAt(socket: SocketIO.Socket) {
        socket.emit("update" + this.valueName, JSON.stringify(this.value));
    }

    //この時渡すソケットは一斉送信用の用途で使われる
    constructor(
        valueName: string,
        socket: SocketIO.Namespace) {
        this.socket = socket;
        this.valueName = valueName;
    }
}
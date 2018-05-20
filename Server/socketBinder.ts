
//値をクライアントと効率よくシェアできるクラス
export class SocketBinder<T>{
    private value: T;
    private socket: SocketIO.Namespace;
    private valueName: string;
    private updateValueCallBack: (value: T) => void;
    private readonlyFlag: boolean;

    get ValueName() {
        return this.valueName;
    }

    get Value() {
        return this.value;
    }

    set Value(value: T) {
        this.value = value;
        this.socket.emit("get" + this.valueName, JSON.stringify(value));
    }

    //ソケットと繋ぐ
    connectSocket(socket: SocketIO.Socket) {
        if (this.readonlyFlag == false)
            socket.on("set" + this.valueName, (str: string) => {
                const value: T = JSON.parse(str);
                this.Value = value;
            });
        socket.emit("get" + this.valueName, JSON.stringify(this.value));
    }


    //この時渡すソケットは一斉送信用の用途で使われる
    constructor(
        valueName: string,
        socket: SocketIO.Namespace,
        readonlyFlag: boolean = false,
        updateValueCallBack: (value: T) => void = (_) => { }) {

        this.readonlyFlag = readonlyFlag;
        this.socket = socket;
        this.valueName = valueName;
        this.updateValueCallBack = updateValueCallBack;
    }
}
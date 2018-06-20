//値をサーバと効率よくシェアできるクラス
export class SocketBinder<T>{
    private value: T;
    protected socket: SocketIOClient.Socket;
    private valueName: string;
    private updateValueCallBack: (value: T) => void = (_) => { };
    get ValueName() {
        return this.valueName;
    }

    get Value() {
        return this.value;
    }

    onUpdate(f: (value: T) => void = (_) => { }) {
        this.updateValueCallBack = f;
    }

    constructor(
        valueName: string,
        socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.valueName = valueName;
        socket.on("update" + valueName, (str: string) => {
            this.value = JSON.parse(str);
            this.updateValueCallBack(this.value);
        });
    }
}
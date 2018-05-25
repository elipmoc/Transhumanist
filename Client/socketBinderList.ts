import { SocketBinder } from "./socketBinder";

export class SocketBinderList<T> extends SocketBinder<T[]> {
    private popValueCallBack: (value: T) => void = (_) => { };
    private pushValueCallBack: (value: T) => void = (_) => { };
    private setAtValueCallBack: (id: number, value: T) => void = (_) => { };

    constructor(
        valueName: string,
        socket: SocketIOClient.Socket) {
        super(valueName, socket);
        this.socket.on("push" + this.ValueName, (str: string) => {
            this.pushValueCallBack(JSON.parse(str));
        });
        this.socket.on("pop" + this.ValueName, (str: string) => {
            this.popValueCallBack(JSON.parse(str));
        });
        this.socket.on("setAt" + this.ValueName, (str: string) => {
            const pair: { index: number, value: T } = JSON.parse(str);
            this.setAtValueCallBack(pair.index, pair.value);
        });
    }

    onPush(f: (value: T) => void = (_) => { }) {
        this.pushValueCallBack = f;
    }
    onPop(f: (value: T) => void = (_) => { }) {
        this.popValueCallBack = f;
    }
    onSetAt(f: (id: number, value: T) => void = (_) => { }) {
        this.setAtValueCallBack = f;
    }
}
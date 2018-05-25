import { SocketBinder } from "./socketBinder";

export class SocketBinderList<T> extends SocketBinder<T[]> {
    //この時渡すソケットは一斉送信用の用途で使われる
    constructor(
        valueName: string,
        socket: SocketIO.Namespace) {
        super(valueName, socket);
    }

    push(x: T) {
        this.Value.push(x);
        this.socket.emit("push" + this.ValueName, JSON.stringify(x));
    }
    pop() {
        const popValue = this.Value.pop();
        this.socket.emit("pop" + this.ValueName, JSON.stringify(popValue));
        return popValue;
    }
    setAt(index: number, x: T) {
        this.Value[index] = x;
        this.socket.emit("setAt" + this.ValueName, JSON.stringify({ index: index, value: x }));
    }
}
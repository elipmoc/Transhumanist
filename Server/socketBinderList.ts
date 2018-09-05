import { SocketBinder } from "./socketBinder";

export class SocketBinderList<T> extends SocketBinder<T[]> {
    //この時渡すソケットは一斉送信用の用途で使われる
    constructor(
        valueName: string,
        privateFlag: boolean = false,
        privateSocketTags: Array<string> = []
    ) {
        super(valueName, privateFlag, privateSocketTags);
        this.Value = [];
    }

    push(x: T) {
        this.Value.push(x);
        this.socketEmit("push" + this.ValueName, JSON.stringify(x));
    }
    pop() {
        const popValue = this.Value.pop();
        this.socketEmit("pop" + this.ValueName, JSON.stringify(popValue));
        return popValue;
    }
    setAt(index: number, x: T) {
        this.Value[index] = x;
        this.socketEmit("setAt" + this.ValueName, JSON.stringify({ index: index, value: x }));
    }
}
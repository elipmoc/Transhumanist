import { BinderBase } from "./binderBase";

export class Namespace {
    private socketBinderList: BinderBase[] = [];
    private namespace: SocketIO.Namespace;

    constructor(namespace: SocketIO.Namespace) {
        this.namespace = namespace;
    }

    addSocketBinder(...socketBinders: BinderBase[]) {
        socketBinders.forEach(x => {
            this.socketBinderList.push(x);
            x.setNamespace(this.namespace);
        });
    }

    addSocket(socketTag: string, socket: SocketIO.Socket) {
        this.socketBinderList.forEach(x => x.connect(socketTag, socket));
    }

}

export class BindManager {
    private namespaceList: { [index: string]: Namespace } = {};

    registNamespace(name: string, namespace: SocketIO.Namespace) {
        this.namespaceList[name] = new Namespace(namespace);
        return this.namespaceList[name];
    }

    addSocketBinder(namespaceName: string, socketBinder: BinderBase) {
        this.namespaceList[namespaceName].addSocketBinder(socketBinder);
    }

    addSocket(namespaceName: string, socketTag: string, socket: SocketIO.Socket) {
        this.namespaceList[namespaceName].addSocket(socketTag, socket);
    }
}

import { SocketBinderBase } from "./socketBinderBase";

export class SocketNamespace {
    private socketBinderList: SocketBinderBase[] = [];
    private namespace: SocketIO.Namespace;

    constructor(namespace: SocketIO.Namespace) {
        this.namespace = namespace;
    }

    addSocketBinder(...socketBinders: SocketBinderBase[]) {
        socketBinders.forEach(x => {
            this.socketBinderList.push(x);
            x.setNamespace(this.namespace);
        });
    }

    addSocket(socketTag: string, socket: SocketIO.Socket) {
        this.socketBinderList.forEach(x => x.connect(socketTag, socket));
    }

}

export class SocketBindManager {
    private namespaceList: { [index: string]: SocketNamespace } = {};

    registNamespace(name: string, namespace: SocketIO.Namespace) {
        this.namespaceList[name] = new SocketNamespace(namespace);
        return this.namespaceList[name];
    }

    addSocketBinder(namespaceName: string, socketBinder: SocketBinderBase) {
        this.namespaceList[namespaceName].addSocketBinder(socketBinder);
    }

    addSocket(namespaceName: string, socketTag: string, socket: SocketIO.Socket) {
        this.namespaceList[namespaceName].addSocket(socketTag, socket);
    }
}
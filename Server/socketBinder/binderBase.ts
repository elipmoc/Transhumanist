export interface BinderBase {
    setNamespace(namespace: SocketIO.Namespace): void;
    connect(socketTag: string, socket: SocketIO.Socket): void
}
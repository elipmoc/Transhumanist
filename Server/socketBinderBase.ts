export interface SocketBinderBase {
    setNamespace(namespace: SocketIO.Namespace): void;
    connect(socketTag: string, socket: SocketIO.Socket): void
}
import { RoomControler } from "./roomControler";

export function createControler(socket: SocketIO.Server) {
    const loginSocket = socket.of("/login");
    new RoomControler(socket, loginSocket);
}
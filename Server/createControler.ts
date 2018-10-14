import { RoomControler } from "./roomControler";

export function createControler(socket: SocketIO.Server) {
    const loginSocket = socket.of("/login");
    const boardSocket = socket.of("/board");
    new RoomControler(boardSocket, loginSocket);
}
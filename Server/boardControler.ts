import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";
import { RoomControler } from "./roomControler";

export class BoardControler {

    private roomControler: RoomControler;
    constructor(roomControler: RoomControler, boardSocket: SocketIO.Namespace) {
        this.roomControler = roomControler;
        boardSocket.on("connection",
            (socket: SocketIO.Socket) => {
                socket.on("joinBoardGame", (str) => {
                    const requestBoardGameJoin: RequestBoardGameJoin = JSON.parse(str);
                    roomControler.joinUser(socket, requestBoardGameJoin);
                });
            }
        );
    }
}
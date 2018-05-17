import { BoardControler } from "../Server/boardControler";
import { setTimeout } from "timers";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";

export class BoardSocket {
    private boardControler: BoardControler;
    constructor(socket: SocketIO.Server, boardControler: BoardControler) {
        const boardSocket = socket.of("/board");
        boardSocket.on("connection",
            (socket: SocketIO.Socket) => {
                socket.on("joinBoardGame", (str) => {
                    const requestBoardGameJoin: RequestBoardGameJoin = JSON.parse(str);
                    boardControler.joinUser(socket, requestBoardGameJoin);
                });

            }
        );
    }
}
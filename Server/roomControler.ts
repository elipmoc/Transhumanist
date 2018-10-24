import { RoomList } from "./roomList";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";
import { SocketBinder } from "./socketBinder";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";

export class RoomControler {
    private roomList: RoomList;

    constructor(boardSocket: SocketIO.Namespace, loginSocket: SocketIO.Namespace) {
        const loginSocketManager = new SocketBinder.BindManager().registNamespace("login", loginSocket);
        this.roomList = new RoomList(boardSocket, loginSocketManager);

        boardSocket.on("connection",
            socket => {
                socket.on("joinBoardGame", (str) => {
                    const requestBoardGameJoin: RequestBoardGameJoin = JSON.parse(str);
                    if (!this.roomList.joinUser(socket, requestBoardGameJoin))
                        socket.emit("rejectBoardGame");
                });
            }
        );

        //クライアントが繋がった時を処理
        loginSocket.on("connection", (socket: SocketIO.Socket) => {
            loginSocketManager.addSocket("", socket);

            socket.on("requestCreateRoom", (data: string) => {
                let request: RequestCreateRoomData = JSON.parse(data);
                let result: ResultCreateRoomData = this.roomList.createRoom(request);

                socket.emit("resultCreateRoom", JSON.stringify(result));
            });
            socket.on("requestEnterRoom", (data: string) => {
                let request: RequestEnterRoomData = JSON.parse(data);
                let result: ResultEnterRoomData = this.roomList.enterRoom(request);
                const playerDataForClient: PlayerDataForClient =
                    { roomId: request.roomId, playerId: result.playerId, playerName: request.playerName };
                socket.emit("resultEnterRoom", JSON.stringify(result));
            });
            socket.on("requestExistUuid", uuid => {
                if (this.roomList.isExistUuid(uuid)) {
                    socket.emit("resultExistUuid", JSON.stringify(true));
                } else {
                    socket.emit("resultExistUuid", JSON.stringify(false));
                }
            });
        });
    }
}
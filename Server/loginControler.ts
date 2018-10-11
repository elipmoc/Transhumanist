import { RoomDataForClient } from "../Share/roomDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { RoomControler } from "./roomControler";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { PlayerDataForClient } from "../Share/playerDataForClient";

export class LoginControler {
    private loginSocket: SocketIO.Namespace;
    private roomControler: RoomControler;
    constructor(roomControler: RoomControler, loginSocket: SocketIO.Namespace) {
        this.roomControler = roomControler;
        this.loginSocket = loginSocket;

        //クライアントが繋がった時を処理
        loginSocket.on("connection", (socket: SocketIO.Socket) => {
            socket.emit("sendRoomList", JSON.stringify(this.roomControler.sendRoomList()));

            socket.on("requestCreateRoom", (data: string) => {
                let request: RequestCreateRoomData = JSON.parse(data);
                let result: ResultCreateRoomData = this.roomControler.createRoom(request);

                socket.emit("resultCreateRoom", JSON.stringify(result));
            });
            socket.on("requestEnterRoom", (data: string) => {
                let request: RequestEnterRoomData = JSON.parse(data);
                let result: ResultEnterRoomData = this.roomControler.enterRoom(request);
                const playerDataForClient: PlayerDataForClient =
                    { roomId: request.roomId, playerId: result.playerId, playerName: request.playerName };
                this.loginSocket.emit("addMember", JSON.stringify(playerDataForClient));
                socket.emit("resultEnterRoom", JSON.stringify(result));
            });
            socket.on("requestExistUuid", uuid => {
                if (roomControler.isExistUuid(uuid)) {
                    socket.emit("resultExistUuid", JSON.stringify(true));
                } else {
                    socket.emit("resultExistUuid", JSON.stringify(false));
                }
            });
        });
    }

    addRoom(roomDataForClient: RoomDataForClient) {
        this.loginSocket.emit("addRoom", JSON.stringify(roomDataForClient));
    }

    deleteMember(playerDataForClient: PlayerDataForClient) {
        this.loginSocket.emit("deleteMember", JSON.stringify(playerDataForClient));
    }
    deleteRoom(roomId: number) {
        this.loginSocket.emit("deleteRoom", roomId);
    }

    updatePlayFlag(playFlagDataForClient: PlayFlagDataForClient) {
        this.loginSocket.emit("updatePlayFlag", JSON.stringify(playFlagDataForClient));
    }
}
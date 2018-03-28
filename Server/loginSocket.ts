import { LoginControler } from "./loginControler";
import { BoardControler } from "./boardControler";
import { RoomEvents } from "./roomEvents";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class LoginSocket {
    private loginControler: LoginControler;

    constructor(socket: SocketIO.Server, boardControler: BoardControler) {
        let loginSocket = socket.of("/login");
        let roomEvents: RoomEvents = {
            addMemberCallBack: (playerDataForClient: PlayerDataForClient) => {
                loginSocket.emit("addMember", JSON.stringify(playerDataForClient));
            },
            deleteMemberCallBack: (playerDataForClient: PlayerDataForClient) => {
                loginSocket.emit("deleteMember", JSON.stringify(playerDataForClient));
            },
            updatePlayFlagCallBack: (playFlagDataForClient: PlayFlagDataForClient) => {
                loginSocket.emit("updatePlayFlag", JSON.stringify(playFlagDataForClient));
            },
            deleteRoomCallBack: (roomId: number) => {
                loginSocket.emit("deleteRoom", roomId);
            }
        };
        this.loginControler = new LoginControler(boardControler, roomEvents);
        //クライアントが繋がった時を処理
        loginSocket.on("connection", (socket: SocketIO.Socket) => {
            socket.emit("sendRoomList", JSON.stringify(this.loginControler.sendRoomList()));

            socket.on("requestCreateRoom", (data: string) => {
                let request: RequestCreateRoomData = JSON.parse(data);
                let result: ResultCreateRoomData = this.loginControler.createRoom(request);

                if (result.successFlag) {
                    console.log(JSON.stringify(this.loginControler.sendRoomList()));
                    socket.emit("sendRoomList", JSON.stringify(this.loginControler.sendRoomList()));
                }
                socket.emit("resultCreateRoom", JSON.stringify(result));
            });
            socket.on("requestEnterRoom", (data: string) => {
                let request: RequestEnterRoomData = JSON.parse(data);
                let result: ResultEnterRoomData = this.loginControler.enterRoom(request);
                socket.emit("resultEnterRoom", JSON.stringify(result));
            });
        });
    };
}
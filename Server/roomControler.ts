import { RoomList } from "./roomList";
import { RequestCreateRoomData } from "../Client/src/Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Client/src/Share/requestEnterRoomData";
import { SocketBinder } from "./socketBinder";
import { ResultEnterRoomData } from "../Client/src/Share/resultEnterRoomData";
import { ResultCreateRoomData } from "../Client/src/Share/resultCreateRoomData";

export class RoomControler {
    private roomList: RoomList;

    constructor(socket: SocketIO.Server, loginSocket: SocketIO.Namespace) {
        const loginSocketManager = new SocketBinder.BindManager().registNamespace("login", loginSocket);
        this.roomList = new RoomList(socket, loginSocketManager);

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
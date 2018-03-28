import { LoginControler } from "./loginControler";
import { BoardControler } from "./boardControler";
import { RoomEmits } from "./roomEmits";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";

export class LoginSocket {
    private loginControler: LoginControler;

    constructor(socket: SocketIO.Server, boardControler: BoardControler) {
        let loginSocket = socket.of("/login");
        this.loginControler = new LoginControler(boardControler, new RoomEmits(loginSocket));
        //クライアントが繋がった時を処理
        loginSocket.on("connection", (socket: SocketIO.Socket) => {
            socket.emit("sendRoomList", JSON.stringify(this.loginControler.sendRoomList()));

            socket.on("requestCreateRoom", (data: string) => {
                let request: RequestCreateRoomData = JSON.parse(data);
                let result: ResultCreateRoomData = this.loginControler.createRoom(request);

                if (result.successFlag) {
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
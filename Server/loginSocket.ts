import {LoginControler} from "./loginControler";
import {BoardControler} from "./boardControler";
import {RoomEvents} from "./roomEvents";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";

export class LoginSocket {
    private loginControler :LoginControler;
    
    constructor(socket:SocketIO.Server,boardControler:BoardControler){
        let roomEvents:RoomEvents = {
            addMemberCallBack: (playerDataForClient: PlayerDataForClient) => {
                socket.emit("deleteMember", JSON.stringify(playerDataForClient));
            },
            deleteMemberCallBack: (playerDataForClient: PlayerDataForClient) => {
                socket.emit("deleteMember", JSON.stringify(playerDataForClient));
            },
            updatePlayFlagCallBack: (playFlagDataForClient: PlayFlagDataForClient) => {
                socket.emit("updatePlayFlag", JSON.stringify(playFlagDataForClient));
            },
            deleteRoomCallBack: (roomId: number) => {
                socket.emit("deleteRoom", roomId);
            }
        };
        this.loginControler = new LoginControler(boardControler,roomEvents);
        let loginSocket = socket.of("/login");
        //クライアントが繋がった時を処理
        loginSocket.on("connection",(socket:SocketIO.Socket)=>{
            
        });
        /*
        socket.emit("addRoom");
        socket.emit("deleteRoom");
        socket.emit("addMember");
        socket.emit("deleteMember");
        socket.emit("updatePlayFlag");

        socket.on("requestEnterRoom");
        socket.on("requestRoomList");
        socket.emit("sendRoomList");
        socket.emit("resultEnterRoom");
        socket.emit("sendRoomList");
        */
    };
}
import {LoginControler} from "./loginControler";
import {BoardControler} from "./boardControler";
import {RoomEvents} from "./roomEvents";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import {RoomDataForClient} from "../Share/roomDataForClient";

export class LoginSocket {
    private loginControler :LoginControler;
    
    constructor(socket:SocketIO.Server,boardControler:BoardControler){
        let roomEvents:RoomEvents = {
            addMemberCallBack: (playerDataForClient: PlayerDataForClient) => {
                socket.emit("addMember", JSON.stringify(playerDataForClient));
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
            socket.emit("sendRoomList",this.loginControler.sendRoomList());

            socket.on("requestCreateRoom",(data:string)=>{
                let request: RequestCreateRoomData = JSON.parse(data);
                let result : ResultCreateRoomData = this.loginControler.createRoom(request);

                if(result.successFlag){
                    socket.emit("sendRoomList",this.loginControler.sendRoomList());
                }
                socket.emit("resultCreateRoom",result);
            });
            socket.on("requestEnterRoom",(data:string)=>{
                let request: RequestEnterRoomData = JSON.parse(data);
                let result : ResultEnterRoomData = this.loginControler.enterRoom(request);
                socket.emit("resultEnterRoom",result);
            });
        });
    };
}
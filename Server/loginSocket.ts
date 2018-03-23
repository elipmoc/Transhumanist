import {LoginControler} from "../Server/loginControler";
export class LoginSocket {
    private loginControler :LoginControler;
    
    constructor(socket:SocketIO.Server,loginControler:LoginControler){
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
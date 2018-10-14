import * as io from "socket.io-client";
import * as cookies from "js-cookie";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { RoomViewList } from "./login/roomViewList";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { SocketBinderList } from "./socketBinderList";

//サンプルソケットに繋げる
const socket = io("/login");

const roomViewList = new RoomViewList(requestEnter);

socket.on("addRoom", (data: string) => {
    let roomData: RoomDataForClient = JSON.parse(data);
    roomViewList.addRoom(roomData);
});

socket.on("deleteRoom", (data: number) => {
    let roomId: number = data;
    roomViewList.deleteRoom(roomId);
});

/*socket.on("addMember", (data: string) => {
    let member: PlayerDataForClient = JSON.parse(data);
    roomViewList.addMember(member);
});

socket.on("deleteMember", (data: string) => {
    let member: PlayerDataForClient = JSON.parse(data);
    roomViewList.deleteMember(member);
});

socket.on("updatePlayFlag", (data: string) => {
    let playData: PlayFlagDataForClient = JSON.parse(data);
    roomViewList.updatePlayFlag(playData);
});*/

const roomList = new SocketBinderList<RoomDataForClient>("roomList", socket);
roomList.onUpdate(rooms => {
    roomViewList.initRoomList(rooms);
});
roomList.onPush(room => {
    roomViewList.addRoom(room);
})
roomList.onSetAt((id, room) => {
    roomViewList.setRoom(room);
});

let button = document.getElementById("createButton");
button.onclick = () => { requestCreate(); };

let requestBuf: { name: string, data: any } = null;

//requestCreateRoom
function requestCreate() {
    let request: RequestCreateRoomData = {
        roomName: (<HTMLInputElement>document.getElementById("roomName")).value,
        password: (<HTMLInputElement>document.getElementById("pass")).value,
        passwordFlag: (<HTMLInputElement>document.getElementById("passwordFlag")).checked,
        playerName: (<HTMLInputElement>document.getElementById("playerName")).value
    };
    if (request.playerName == "") {
        alert("プレイヤー名が入力されていません！");
    } else if (request.roomName == "") {
        alert("部屋の名前が入力されていません！");
    } else if (request.passwordFlag && request.password == "") {
        alert("パスワードが入力されていません！");
    } else {
        requestBuf = { name: "requestCreateRoom", data: request };
        socket.emit("requestExistUuid", cookies.get("uuid"));
    }
}



socket.on("resultExistUuid", (data: any) => {
    let isExist: boolean = JSON.parse(data);
    if (isExist)
        alert("あなたはすでに別の部屋に入室しています");
    else
        socket.emit(requestBuf.name, JSON.stringify(requestBuf.data));
});

//resultCreateRoom
socket.on("resultCreateRoom", (data: string) => {
    let resultCreateRoomData: ResultCreateRoomData = JSON.parse(data);
    if (resultCreateRoomData.successFlag) {
        console.log("部屋が作成できました！");
        requestEnter(resultCreateRoomData.roomId);
    }
    else {
        console.log(resultCreateRoomData.errorMsg);
    }
});

//requestEnterRoom
function requestEnter(roomId: number) {
    let target = <HTMLInputElement>document.getElementById("playerName");
    let name: string = target.value;

    if (name != "") {
        let requestEnterRoomData: RequestEnterRoomData = {
            roomId: roomId,
            playerName: name,
            password: (<HTMLInputElement>document.getElementById("pass")).value
        }
        cookies.set("roomid", String(roomId));
        socket.emit("requestExistUuid", cookies.get("uuid"));
        requestBuf = { name: "requestEnterRoom", data: requestEnterRoomData };
    } else {
        alert("プレイヤー名が入力されていません！");
    }
}

//resultEnterRoom
socket.on("resultEnterRoom", (data: string) => {
    let resultEnterRoomData: ResultEnterRoomData = JSON.parse(data);
    if (resultEnterRoomData.successFlag) {
        console.log("入室できました！");
        cookies.set("uuid", resultEnterRoomData.uuid);
        cookies.set("playerId", String(resultEnterRoomData.playerId));
        location.href = "board.html";
    }
    else {
        console.log(resultEnterRoomData.errorMsg);
    }
});
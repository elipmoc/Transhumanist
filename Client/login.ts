import * as io from "socket.io-client";
import {RoomDataForClient} from "../Share/roomDataForClient";
import {PlayerDataForClient} from "../Share/playerDataForClient";
import {RoomViewList} from "../Client/roomViewList";

//サンプルソケットに繋げる
const socket = io("/login");

const roomViewList = new RoomViewList(requestEnter);

socket.on("addRoom", (data: string) => {
    let roomData: RoomDataForClient = JSON.parse(data);
    if (roomData != null) roomViewList.addRoom(roomData);
});

socket.on("deleteRoom", (data: number) => {
    let roomId: number = data;
    if (roomId != null) roomViewList.deleteRoom(roomId);
});

socket.on("addMember", (data: string) => {
    let member :PlayerDataForClient = JSON.parse(data);
    if (member != null) roomViewList.addMember(member);
});

socket.on("deleteMember", (data: string) => {
    let member :PlayerDataForClient = JSON.parse(data);
    if (member != null) roomViewList.deleteMember(member);
});

socket.on("updatePlayFlag", (data: string) => {
    let playData = JSON.parse(data);
    if (playData != null) roomViewList.updatePlayFlag(playData.roomID, playData.playFlag);
});

//requestRoomList
function requestRoomList() {
    socket.emit("requestRoomList");
}

//sendRoomList
socket.on("sendRoomList", (data: string) => {
    let RoomList: RoomDataForClient[] = JSON.parse(data);
    roomViewList.initRoomList(RoomList);
});

//requestEnter
function requestEnter(roomId: Number){
    let target = <HTMLInputElement>document.getElementById("playerName");
    let name :string = target.value;

    if(name != ""){
        let data = {roomId: roomId,name: name};
        socket.emit("requestEnter", JSON.stringify(data));
    }else{
        alert("プレイヤー名が入力されていません！");
    }
}


requestRoomList();

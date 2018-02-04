import * as io from "socket.io-client";
import * as type from "../TsServer/roomData";

//サンプルソケットに繋げる
const socket = io("/login");

//部屋のリストを受け取って画面に表示
function initRoomList(roomDataList: type.RoomData[]) {
    for (let i = 0; i < roomDataList.length; i++) {
        addRoom(roomDataList[i]);
    }
}

//部屋を新規追加
function addRoom(roomData: type.RoomData) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let table = document.createElement("table");

    table.setAttribute("class", "roomTable");
    table.setAttribute("id", String(roomData.roomId));

    //テーブル上段
    td.textContent = roomData.roomName;
    tr.appendChild(td);
    td = document.createElement("td");
    td.setAttribute("colspan", "4");
    td.textContent = "入室中のプレイヤー";
    tr.appendChild(td);
    table.appendChild(tr);
    //テーブル下段
    let button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "部屋に入室");

    tr = document.createElement("tr");
    td = document.createElement("td");
    td.setAttribute("class", "playFlag");
    if (roomData.playFlag) {
        td.textContent = "プレイ中";
    }
    else {
        //ここにボタンを追加。
        td.appendChild(button);
    }
    tr.appendChild(td);

    for (let i = 0; i < 4; i++) {
        td = document.createElement("td");
        td.setAttribute("class", "player" + i);
        if (!(roomData.playerList.length < i)) {
            td.textContent = roomData.playerList[i];
        }
        tr.appendChild(td);
    }
    table.appendChild(tr);

    let roomListArea = document.getElementById("roomListArea");
    if (roomListArea != null)
        roomListArea.appendChild(table);
}

//部屋を削除
function deleteRoom(roomID: number) {
    let target = document.getElementById(String(roomID));
    if (target != null && target.parentNode)
        target.parentNode.removeChild(target);
}

//メンバーを追加(playerTagはclass =”player1”等の部分)
function addMember(roomID: number, playerName: string, playerTag: string) {
    let room = document.getElementById(String(roomID))
    if (room != null && room.lastElementChild != null)
        room.lastElementChild.
            getElementsByClassName(playerTag)[0].textContent = playerName;
}

//メンバーを削除(playerTagはclass =”player1”等の部分)
function deleteMember(roomID: number, playerTag: string) {
    let room = document.getElementById(String(roomID));
    if (room != null && room.lastElementChild != null)
        room.lastElementChild.
            getElementsByClassName(playerTag)[0].textContent = "";
}

//プレイ中かどうかが変更
function updatePlayFlag(roomID: number, playFlag: boolean) {

    let room = document.getElementById(String(roomID));
    if (room != null && room.lastElementChild) {
        let target = room.lastElementChild.
            getElementsByClassName("playFlag")[0];
        if (target.children != null) target.textContent = null;

        if (playFlag) {
            target.textContent = "プレイ中";
        }
        else {
            let button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", "部屋に入室");

            //ここにボタンを追加。
            target.appendChild(button);
        }
    }
}

//hogeEventとしてデータの受信処理
socket.on("addRoom", (data: string) => {
    let roomData :type.RoomData = JSON.parse(data);
    if(roomData != null) addRoom(roomData);
});

socket.on("deleteRoom",(data:number) => {
    let roomId :number = data;
    if(roomId != null) deleteRoom(roomId);
});

socket.on("addMember",(data: string)=>{
    let member = JSON.parse(data);
    if(member != null) addMember(member.roomID,member.playerName,member.playerTag);
});

socket.on("deleteMember",(data: string)=>{
    let member = JSON.parse(data);
    if(member != null) deleteMember(member.roomID,member.playerTag);
});

socket.on("updatePlayFlag",(data: string)=>{
    let playData = JSON.parse(data);
    if(playData != null) updatePlayFlag(playData.roomID,playData.playFlag);
});

//requestRoomList
function requestRoomList(){
    socket.emit("requestRoomList",null);
}

requestRoomList();

//sendRoomList
socket.on("sendRoomList",(data: string)=>{
    let RoomList: type.RoomData[] = JSON.parse(data);
    initRoomList(RoomList);
});

//requestEnter

//resultEnter
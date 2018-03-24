import { RoomData } from "../Server/roomData";
import { RoomDataMap } from "../Server/roomDataMap";
import { RoomEvents } from "../Server/roomEvents";
import { PlayerData } from "../Server/playerData";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { BoardControler } from "../Server/boardControler";
import * as uuid from "node-uuid";

export class LoginControler {
    private roomDataMap: RoomDataMap;
    private boardControler: BoardControler;
    private roomEvents: RoomEvents;

    constructor(boardControler: BoardControler, roomEvents: RoomEvents) {
        this.boardControler = boardControler;
        this.roomEvents = roomEvents;
        this.roomDataMap = new RoomDataMap;
    }
    createRoom(requestCreateRoomData: RequestCreateRoomData) {
        let request = requestCreateRoomData;
        let roomData = new RoomData(1, request.roomName, request.password, this.roomEvents);

        //ここ条件式が追加される

        this.roomDataMap.addRoomData(roomData);
        let result: ResultCreateRoomData = {
            successFlag: true,
            errorMsg: ""
        };
        return result
    }
    enterRoom(requestEnterRoomData: RequestEnterRoomData) {
        let request = requestEnterRoomData;
        let roomData = this.roomDataMap.getRoomData(request.roomId);
        if (roomData == undefined) {
            //部屋が存在しない
            let result: ResultEnterRoomData = {
                successFlag: false,
                errorMsg: "この部屋は存在しません。",
                uuid: ""
            };
            return result
        }
        else if (roomData.getPlayerCount() == 4) {
            //部屋満員
            let result: ResultEnterRoomData = {
                successFlag: false,
                errorMsg: "この部屋は満員のため、入室出来ません。",
                uuid: ""
            };
            return result
        } else {
            //プレイヤー入室
            let playerData = new PlayerData(uuid.v4(), request.playerName);
            roomData.addMember(playerData);

            let result: ResultEnterRoomData = {
                successFlag: true,
                errorMsg: "",
                uuid: playerData.getUuid()
            };
            return result
        }
    }
    sendRoomList() {
        return this.roomDataMap.toArray().map(x => {
            let roomDataForClient: RoomDataForClient = {
                roomName: x.getRoomName(),
                roomId: x.getRoomId(),
                playFlag: x.getPlayFlag(),
                playerList: x.getPlayerNameList(),
                passwordFlag: x.needPassword()
            };
        });
    }
}
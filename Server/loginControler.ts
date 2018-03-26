import { RoomData } from "./roomData";
import { RoomDataMap } from "./roomDataMap";
import { RoomEvents } from "./roomEvents";
import { PlayerData } from "./playerData";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { BoardControler } from "./boardControler";
import { RoomIdGenerator } from "./roomIdGenerator";

import * as uuid from "node-uuid";

export class LoginControler {
    private roomDataMap: RoomDataMap;
    private boardControler: BoardControler;
    private roomEvents: RoomEvents;
    private roomIdGenerator: RoomIdGenerator;

    constructor(boardControler: BoardControler, roomEvents: RoomEvents) {
        this.boardControler = boardControler;
        this.roomEvents = roomEvents;
        this.roomDataMap = new RoomDataMap;
        this.roomIdGenerator = new RoomIdGenerator;

        const hoge = this.roomEvents.deleteRoomCallBack;
        this.roomEvents.deleteRoomCallBack = (roomId: number) => {
            hoge(roomId);
            this.roomIdGenerator.releaseRoomId(roomId);
        }
    }
    createRoom(requestCreateRoomData: RequestCreateRoomData) {
        let request = requestCreateRoomData;
        let roomId = this.roomIdGenerator.getRoomId();

        //roomIdがundefined
        if (roomId == null) {
            let result: ResultCreateRoomData = {
                successFlag: false,
                errorMsg: "これ以上は部屋が作れません。"
            };
            return result;
        }

        let roomData = new RoomData(roomId, request.roomName, request.password, this.roomEvents);
        this.roomDataMap.addRoomData(roomData);
        let result: ResultCreateRoomData = {
            successFlag: true,
            errorMsg: ""
        };
        return result;
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
            return result;
        }
        else if (roomData.getPlayerCount() == 4) {
            //部屋満員
            let result: ResultEnterRoomData = {
                successFlag: false,
                errorMsg: "この部屋は満員のため、入室出来ません。",
                uuid: ""
            };
            return result;
        } else {
            //プレイヤー入室
            let playerData = new PlayerData(uuid.v4(), request.playerName);
            roomData.addMember(playerData);

            let result: ResultEnterRoomData = {
                successFlag: true,
                errorMsg: "",
                uuid: playerData.getUuid()
            };
            return result;
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
            return roomDataForClient;
        });
    }
}
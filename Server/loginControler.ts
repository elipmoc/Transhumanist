import { RoomData } from "./roomData";
import { RoomDataMap } from "./roomDataMap";
import { RoomEvents } from "./roomEvents";
import { PlayerData } from "./playerData";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import {
    ResultCreateRoomData, successResultCreateRoomData, faildResultCreateRoomData
} from "../Share/resultCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import {
    ResultEnterRoomData, successResultEnterRoomData, faildResultEnterRoomData
} from "../Share/resultEnterRoomData";
import { BoardControler } from "./boardControler";
import { RoomIdGenerator } from "./roomIdGenerator";
import { PasswordInfo } from "./passwordInfo";
import * as uuid from "node-uuid";
import { RoomEmits } from "./RoomEmits";

export class LoginControler {
    private roomDataMap: RoomDataMap;
    private boardControler: BoardControler;
    private roomEvents: RoomEvents;
    private roomIdGenerator: RoomIdGenerator;

    constructor(boardControler: BoardControler, roomEmits: RoomEmits) {
        this.boardControler = boardControler;
        this.roomIdGenerator = new RoomIdGenerator;
        this.roomEvents = new RoomEvents(roomEmits, this.roomIdGenerator.releaseRoomId);
        this.roomDataMap = new RoomDataMap;
    }

    createRoom(requestCreateRoomData: RequestCreateRoomData) {
        let request = requestCreateRoomData;
        let roomId = this.roomIdGenerator.getRoomId();

        //roomIdがnull
        if (roomId == null)
            return faildResultCreateRoomData("これ以上は部屋が作れません。");

        let roomData
            = new RoomData(
                roomId,
                request.roomName,
                new PasswordInfo(request.password, request.passwordFlag),
                this.roomEvents
            );

        this.roomDataMap.addRoomData(roomData);
        return successResultCreateRoomData(roomId);
    }

    enterRoom(requestEnterRoomData: RequestEnterRoomData) {
        let request = requestEnterRoomData;
        let roomData = this.roomDataMap.getRoomData(request.roomId);

        if (roomData == undefined)
            //部屋が存在しない
            return faildResultEnterRoomData("この部屋は存在しません。");
        if (roomData.getPlayerCount() == 4)
            //部屋満員
            return faildResultEnterRoomData("この部屋は満員のため、入室出来ません。");
        if (roomData.getPasswordInfo().passwordCheck(requestEnterRoomData.password) == false) {
            //パスワードが違う
            return faildResultEnterRoomData("パスワードが違います");
        }

        //プレイヤー入室
        let playerData = new PlayerData(uuid.v4(), request.playerName);
        roomData.addMember(playerData);
        return successResultEnterRoomData(playerData.getUuid());
    }

    sendRoomList() {
        return this.roomDataMap.toArray().map(x => {
            let roomDataForClient: RoomDataForClient = {
                roomName: x.getRoomName(),
                roomId: x.getRoomId(),
                playFlag: x.getPlayFlag(),
                playerList: x.getPlayerNameList(),
                passwordFlag: x.getPasswordInfo().isNeedPassword()
            };
            return roomDataForClient;
        });
    }
}
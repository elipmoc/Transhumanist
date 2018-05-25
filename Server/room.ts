import { RoomData } from "./roomData";
import { BoardGame } from "./boardGame";
import { RoomEvents } from "./roomEvents";
import { PasswordInfo } from "./passwordInfo";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import {
    successResultEnterRoomData, faildResultEnterRoomData
} from "../Share/resultEnterRoomData";
import { PlayerData } from "./playerData";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class Room {
    private roomData: RoomData;
    private boardGame: BoardGame;
    private roomEvents: RoomEvents;
    constructor(roomId: number, roomName: string, passwordInfo: PasswordInfo, roomEvents: RoomEvents, boardSocket: SocketIO.Namespace) {
        this.roomEvents = roomEvents;
        this.roomData = new RoomData(roomId, roomName, passwordInfo);
        this.boardGame = new BoardGame(this.roomData, boardSocket);
    }

    enterRoom(requestEnterRoomData: RequestEnterRoomData, uuid: string) {
        if (this.roomData.getPlayerCount() == 4)
            //部屋満員
            return faildResultEnterRoomData("この部屋は満員のため、入室出来ません。");
        if (this.roomData.getPasswordInfo().passwordCheck(requestEnterRoomData.password) == false)
            //パスワードが違う
            return faildResultEnterRoomData("パスワードが違います");

        //プレイヤー入室
        let playerData = new PlayerData(uuid, requestEnterRoomData.playerName);
        const playerId = this.roomData.addMember(playerData);
        this.boardGame.addMember(playerData, playerId);
        return successResultEnterRoomData(playerData.getUuid(), playerId);
    }

    joinUser(socket: SocketIO.Socket, uuid: string) {
        this.boardGame.joinUser(socket, uuid);
    }

    getRoomDataForClient() {
        let roomDataForClient: RoomDataForClient = {
            roomName: this.roomData.getRoomName(),
            roomId: this.roomData.getRoomId(),
            playFlag: this.roomData.getPlayFlag(),
            playerList: this.roomData.getPlayerNameList(),
            passwordFlag: this.roomData.getPasswordInfo().isNeedPassword()
        };
        return roomDataForClient;
    }

    deleteMember(uuid: string) {
        //TODOあとで実装する
    }

    deleteRoom() {
        //TODOあとで実装する
    }
}
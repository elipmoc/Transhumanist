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
import { BoardGameStatusKind } from "./boardGame/boardGameStatusKind";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";

export class Room {
    private roomData: RoomData;
    private boardGame: BoardGame;
    private roomEvents: RoomEvents;
    private updateCallback: () => void;
    private roomId: number;
    private boardSocket: SocketIO.Namespace;

    constructor(roomId: number, roomName: string, passwordInfo: PasswordInfo, roomEvents: RoomEvents, socket: SocketIO.Server) {
        this.roomId = roomId;
        this.roomEvents = roomEvents;
        this.roomData = new RoomData(roomId, roomName, passwordInfo);
        this.boardSocket = socket.of(`/room${roomId}`);
        this.boardSocket.on("connection",
            socket => {
                socket.on("joinBoardGame", (str) => {
                    const requestBoardGameJoin: RequestBoardGameJoin = JSON.parse(str);
                    if (!this.boardGame.joinUser(socket, requestBoardGameJoin.uuid))
                        socket.emit("rejectBoardGame");
                });
            }
        );
        this.boardGame = new BoardGame(this.boardSocket, roomId);
        this.boardGame.onDeleteMember(uuid => this.deleteMember(uuid));
        this.boardGame.onDeleteRoom(this.roomEvents.deleteRoomCallBack);
        this.boardGame.onChangeStatus(status => {
            if (
                this.roomData.PlayFlag && status == BoardGameStatusKind.wait ||
                !this.roomData.PlayFlag && status != BoardGameStatusKind.wait
            ) {
                this.roomData.PlayFlag = !this.roomData.PlayFlag;
                this.updateCallback();
            }
        });
    }


    dispose() {
        this.boardSocket.removeAllListeners();
    }

    get RoomId() { return this.roomId; }

    onUpdate(f: () => void) {
        this.updateCallback = f;
    }

    enterRoom(requestEnterRoomData: RequestEnterRoomData, uuid: string) {
        if (this.roomData.getPlayerCount() == 4)
            //部屋満員
            return faildResultEnterRoomData("この部屋は満員のため、入室出来ません。");
        if (this.roomData.getPasswordInfo().passwordCheck(requestEnterRoomData.password) == false)
            //パスワードが違う
            return faildResultEnterRoomData("パスワードが違います");
        if (this.boardGame.isWait() == false)
            return faildResultEnterRoomData("もうプレイ中です");

        //プレイヤー入室
        let playerData = new PlayerData(uuid, requestEnterRoomData.playerName);
        const playerId = this.roomData.addMember(playerData);
        this.boardGame.addMember(playerData, playerId);
        this.updateCallback();
        return successResultEnterRoomData(playerData.getUuid(), playerId);
    }

    getRoomDataForClient() {
        let roomDataForClient: RoomDataForClient = {
            roomName: this.roomData.getRoomName(),
            roomId: this.roomData.getRoomId(),
            playFlag: this.roomData.PlayFlag,
            playerList: this.roomData.getPlayerNameList(),
            passwordFlag: this.roomData.getPasswordInfo().isNeedPassword()
        };
        return roomDataForClient;
    }

    private deleteMember(uuid: string) {
        this.roomData.deleteMember(uuid);
        this.roomEvents.deleteMemberCallBack(uuid);
        this.updateCallback();
    }
}
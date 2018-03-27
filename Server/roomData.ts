import { RoomEvents } from "../Server/roomEvents";
import { PlayerData } from "../Server/playerData";
import { PlayerDataList } from "../Server/playerDataList";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PasswordInfo } from "./passwordInfo";
import { PassThrough } from "stream";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerDataList;
    private playFlag: boolean;
    private passwordInfo: PasswordInfo;
    private roomEvents: RoomEvents;

    constructor(roomId: number, roomName: string, passwordInfo: PasswordInfo, roomEvents: RoomEvents) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.passwordInfo = passwordInfo;
        this.playFlag = false;
        this.roomEvents = roomEvents;

        this.playerDataList = new PlayerDataList;
    }

    getRoomId() { return this.roomId; }

    getRoomName() { return this.roomName; }

    getPlayFlag() { return this.playFlag; }

    setPlayFlag(playFlag: boolean) {
        this.playFlag = playFlag;
        let playFlagDataForClient: PlayFlagDataForClient
            = { playFlag: playFlag, roomId: this.roomId };
        this.roomEvents.updatePlayFlagCallBack(playFlagDataForClient);
    }

    getPlayerData(uuid: string) { this.playerDataList.getPlayerData(uuid); }

    deleteMember(uuid: string) {
        this.playerDataList.deleteMember(uuid);
        const playerDataForClient: PlayerDataForClient =
            {
                roomId: this.roomId,
                playerId: this.playerDataList.getPlayerId(uuid),
                playerName: ""
            };
        this.roomEvents.deleteMemberCallBack(playerDataForClient);
    }

    addMember(playerData: PlayerData) {
        this.playerDataList.addMember(playerData);
        const playerDataForClient: PlayerDataForClient =
            {
                roomId: this.roomId,
                playerId: this.playerDataList.getPlayerId(playerData.getUuid()),
                playerName: playerData.getName()
            };
        this.roomEvents.addMemberCallBack(playerDataForClient);
    }

    getPasswordInfo() { return this.passwordInfo; }

    deleteRoom() { this.roomEvents.deleteRoomCallBack(this.roomId); }

    getPlayerCount() { return this.playerDataList.getPlayerCount(); }

    getPlayerNameList() { return this.playerDataList.getPlayerNameList(); }
}

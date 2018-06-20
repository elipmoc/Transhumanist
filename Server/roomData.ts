import { PlayerData } from "../Server/playerData";
import { PlayerDataList } from "../Server/playerDataList";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { PasswordInfo } from "./passwordInfo";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerDataList;
    private playFlag: boolean;
    private passwordInfo: PasswordInfo;
    //private roomEvents: RoomEvents;

    constructor(roomId: number, roomName: string, passwordInfo: PasswordInfo, /*roomEvents: RoomEvents*/) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.passwordInfo = passwordInfo;
        this.playFlag = false;
        // this.roomEvents = roomEvents;

        this.playerDataList = new PlayerDataList;

        let roomData: RoomDataForClient = {
            roomName: this.roomName,
            roomId: this.roomId,
            playFlag: this.playFlag,
            playerList: this.playerDataList.getPlayerNameList(),
            passwordFlag: this.passwordInfo.isNeedPassword()
        };
        //  this.roomEvents.addRoom(roomData);
    }

    getRoomId() { return this.roomId; }

    getRoomName() { return this.roomName; }

    getPlayFlag() { return this.playFlag; }

    setPlayFlag(playFlag: boolean) {
        this.playFlag = playFlag;
        let playFlagDataForClient: PlayFlagDataForClient
            = { playFlag: playFlag, roomId: this.roomId };
        //this.roomEvents.updatePlayFlag(playFlagDataForClient);
    }

    getPlayerData(uuid: string) {
        return this.playerDataList.getPlayerData(uuid);
    }

    deleteMember(uuid: string) {
        this.playerDataList.deleteMember(uuid);
    }

    addMember(playerData: PlayerData) {
        this.playerDataList.addMember(playerData);
        return this.playerDataList.getPlayerId(playerData.getUuid());
    }

    getPasswordInfo() { return this.passwordInfo; }

    deleteRoom() {
        this.playerDataList.getPlayerUuidList()
            .forEach(x => this.deleteMember(x));
        //this.roomEvents.deleteRoom(this.roomId);
    }

    getPlayerCount() { return this.playerDataList.getPlayerCount(); }

    getPlayerNameList() { return this.playerDataList.getPlayerNameList(); }
}

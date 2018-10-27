import { PlayerData } from "./playerData";
import { PlayerDataList } from "./playerDataList";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { PasswordInfo } from "./passwordInfo";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerDataList;
    private playFlag: boolean;
    private passwordInfo: PasswordInfo;

    constructor(roomId: number, roomName: string, passwordInfo: PasswordInfo, /*roomEvents: RoomEvents*/) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.passwordInfo = passwordInfo;
        this.playFlag = false;

        this.playerDataList = new PlayerDataList;
    }

    getRoomId() { return this.roomId; }

    getRoomName() { return this.roomName; }

    get PlayFlag() { return this.playFlag; }

    set PlayFlag(playFlag: boolean) {
        this.playFlag = playFlag;
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
    }

    getPlayerCount() { return this.playerDataList.getPlayerCount(); }

    getPlayerNameList() { return this.playerDataList.getPlayerNameList(); }
}

import { RoomEvents } from "../Server/roomEvents";
import { PlayerData } from "../Server/playerData";
import { PlayerDataList } from "../Server/playerDataList";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { PlayerDataForClient } from "../Share/playerDataForClient";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerDataList;
    private playFlag: boolean;
    private passwordFlag: boolean;
    private password: string;
    private roomEvents: RoomEvents;

    constructor(roomId: number, roomName: string, password: string, roomEvents: RoomEvents) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.password = password;
        this.passwordFlag = (password == "");
        this.playFlag = false;
        this.roomEvents = roomEvents;
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

    deleteMember(uuid: string) { this.playerDataList.deleteMember(uuid); }

    addMember(playerData: PlayerData) {
        const playerDataForClient: PlayerDataForClient =
            {
                roomId: this.roomId,
                playerId: this.playerDataList.getPlayerCount() + 1,
                playerName: playerData.getName()
            };
        this.roomEvents.addMemberCallBack(playerDataForClient);
        this.playerDataList.addMember(playerData);
    }

    passwordCheck(str: string) { return this.password == str; }

    needPassword() { return this.passwordFlag; }

    deleteRoom() { this.roomEvents.deleteRoomCallBack(this.roomId); }

    getPlayerCount() { return this.playerDataList.getPlayerCount(); }

    getPlayerNameList() { return this.playerDataList.getPlayerNameList(); }
}

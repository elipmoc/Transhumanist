import { RoomEvents } from "../Server/roomEvents";
import { PlayerData } from "../Server/playerData";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerData[];
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

    getPlayerData(uuid: string) { }

    deleteMember(uuid: string) { }

    addMember(playerData: PlayerData) { }

    passwordCheck(str: string) { return this.password == str; }

    needPassword() { return this.passwordFlag; }

    deleteRoom() { this.roomEvents.deleteRoomCallBack(this.roomId); }
}

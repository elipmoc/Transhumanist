import { RoomEvents } from "../Server/roomEvents";
import { PlayerData } from "../Server/playerData";

export class RoomData {
    private roomId: number;
    private roomName: string;
    private playerDataList: PlayerData[];
    private playFlag: boolean;
    private passwordFlag: boolean;
    private password: string;
    private roomEvents: RoomEvents;

    constructor(roomId: number, roomName: string, password: string, roomEvents: RoomEvents) { }
    getRoomId() { return this.roomId; }
    getRoomName() { return this.roomName; }
    getPlayFlag() { return this.playFlag; }
    setPlayFlag(playFlag: boolean) { }
    exsistUuid(uuid: number) { return true; }
    deleteMember(uuid: number) { }
    addMember(playerData: PlayerData) { }
    passwordCheck(str: string) { return true; }
    needPassword() { return true; }
    deleteRoom() { }
}

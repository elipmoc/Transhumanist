import { RoomData } from "./roomData";
import { BoardPlayerHandle } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";

export class BoardGame {
    private roomData: RoomData;
    constructor(roomData: RoomData) {
        this.roomData = roomData;
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
        if (this.roomData.getPlayerData(uuid)) {
            new BoardPlayerHandle(socket);
        }
    }

    addMember(playerData: PlayerData) { }
}
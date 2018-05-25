import { RoomData } from "./roomData";
import { BoardPlayerHandle } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GameMaster } from "./gameMaster";

export class BoardGame {
    private roomData: RoomData;
    private gameMaster: GameMaster;
    private boardSocket: SocketIO.Namespace;

    constructor(roomData: RoomData, boardSocket: SocketIO.Namespace) {
        this.roomData = roomData;
        this.gameMaster = new GameMaster();
        this.boardSocket = boardSocket;
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
        if (this.roomData.getPlayerData(uuid)) {
            new BoardPlayerHandle(socket);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        this.gameMaster.addMember(playerData, playerId, this.boardSocket);
    }
}
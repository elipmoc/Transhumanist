import { RoomData } from "./roomData";
import { BoardPlayerHandle } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GameMaster } from "./gameMaster";

export class BoardGame {
    private roomData: RoomData;
    private gameMaster: GameMaster;
    private boardSocket: SocketIO.Namespace;

    constructor(boardSocket: SocketIO.Namespace) {
        this.gameMaster = new GameMaster();
        this.boardSocket = boardSocket;
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
        if (this.gameMaster.getGamePlayer(uuid)) {
            new BoardPlayerHandle(socket);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        this.gameMaster.addMember(playerData, playerId, this.boardSocket);
    }
}
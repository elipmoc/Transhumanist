import { RoomData } from "../Server/roomData";
import { BoardGame } from "../Server/boardGame";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";

export class BoardControler {
    private boardGameMap: Map<number, BoardGame> = new Map;
    addBoardGame(roomData: RoomData) {
        this.boardGameMap.set(roomData.getRoomId(), new BoardGame(roomData));
    }
    joinUser(socket: SocketIO.Socket, requestBoardGameJoin: RequestBoardGameJoin) {
        const boardGame = this.boardGameMap.get(requestBoardGameJoin.roomid);
        if (boardGame) {
            boardGame.joinUser(socket, requestBoardGameJoin.uuid);
        }
    }
}
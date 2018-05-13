import { RoomData } from "../Server/roomData";
import { BoardGame } from "../Server/boardGame";

export class BoardControler {
    private boardGameMap: Map<number, BoardGame>;
    addBoardGame(roomData: RoomData) {
        this.boardGameMap.set(roomData.getRoomId(), new BoardGame(roomData));
    }
}
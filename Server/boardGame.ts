import { RoomData } from "./roomData";
import { BoardPlayerHandle, BoardPlayerHandleEvents } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GameMaster } from "./gameMaster";
import { SelectResourceData } from "../Share/selectResourceData";

export class BoardGame {
    private roomData: RoomData;
    private gameMaster: GameMaster;
    private boardSocket: SocketIO.Namespace;

    constructor(boardSocket: SocketIO.Namespace) {
        this.gameMaster = new GameMaster();
        this.boardSocket = boardSocket;
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gameMaster.getGamePlayer(uuid);
        if (gamePlayer) {
            let handle: BoardPlayerHandle;

            const event: BoardPlayerHandleEvents = {
                turnFinishButtonClickCallBack: () => console.log("turnFinishButtonClick"),
                declareWarButtonClickCallBack: () => console.log("declareWarButtonClick"),
                selectLevelCallBack: (level: number) => {
                    console.log("level" + level);
                    handle.setSelectActionWindowVisible(false);
                    setTimeout(() => handle.setSelectActionWindowVisible(true), 3000);
                },
                selectResourceCallBack: (data: SelectResourceData) =>
                    console.log("selectResource player" + String(gamePlayer.PlayerId) + " iconId " + String(data.iconId) + "resource " + String(data.resourceKind))

            }

            handle = new BoardPlayerHandle(socket, event);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        this.gameMaster.addMember(playerData, playerId, this.boardSocket);
    }
}
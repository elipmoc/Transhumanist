import { RoomData } from "./roomData";
import { BoardPlayerHandle, BoardPlayerHandleEvents } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GameMaster } from "./gameMaster";
import { SelectResourceData } from "../Share/selectResourceData";
import { SocketBinder } from "./socketBinder";
import { SocketBinderList } from "./socketBinderList";
import { GamePlayerState } from "../Share/gamePlayerState";
import { ResourceKind } from "../Share/resourceKind";
import { BuildActionKind } from "../Share/buildActionKind";
import { SelectBuildActionData } from "../Share/selectBuildActionData";

export class BoardGame {
    private gameMaster: GameMaster;
    private boardSocket: SocketIO.Namespace;
    private roomId: number;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.gameMaster = new GameMaster();
        this.boardSocket = boardSocket;
        this.roomId = roomId;
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gameMaster.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);
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
                    console.log(`selectResource player${gamePlayer.PlayerId} iconId${data.iconId} resource ${data.resourceKind}`),
                selectBuildActionCallBack: (data: SelectBuildActionData) =>
                    console.log(`selectBuildAction player${gamePlayer.PlayerId} iconId${data.iconId} resource ${data.buildActionKind}`)

            }
            //初期データを送信する
            this.gameMaster.sendToSocket(socket);

            handle = new BoardPlayerHandle(socket, event);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        const state = new SocketBinder<GamePlayerState>("GamePlayerState" + playerId, this.boardSocket);
        const resourceList = new SocketBinderList<ResourceKind>("ResourceKindList" + playerId, this.boardSocket);
        const buildActionList = new SocketBinderList<BuildActionKind>("BuildActionKindList" + playerId, this.boardSocket);
        this.gameMaster.addMember(playerData, playerId, state, resourceList, buildActionList);
    }
}
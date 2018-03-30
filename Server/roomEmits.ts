import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class RoomEmits {
    private loginSocket: SocketIO.Namespace;
    public constructor(loginSocket: SocketIO.Namespace) {
        this.loginSocket = loginSocket;
    }
    public addMemberEmit(playerDataForClient: PlayerDataForClient) {
        this.loginSocket.emit("addMember", JSON.stringify(playerDataForClient));
    }
    public deleteMemberEmit(playerDataForClient: PlayerDataForClient) {
        this.loginSocket.emit("deleteMember", JSON.stringify(playerDataForClient));
    }
    public updatePlayFlagEmit(playFlagDataForClient: PlayFlagDataForClient) {
        this.loginSocket.emit("updatePlayFlag", JSON.stringify(playFlagDataForClient));
    }
    public addRoomEmit(roomData: RoomDataForClient) {
        this.loginSocket.emit("addRoom", JSON.stringify(roomData));
    }
    public deleteRoomEmit(roomId: number) {
        this.loginSocket.emit("deleteRoom", roomId);
    }
}
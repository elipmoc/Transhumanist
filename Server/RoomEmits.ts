import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";

export class RoomEmits {
    private loginSocket: SocketIO.Server;
    public constructor(loginSocket: SocketIO.Server) {
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
    public deleteRoomEmit(roomId: number) {
        this.loginSocket.emit("deleteRoom", roomId);
    }
}
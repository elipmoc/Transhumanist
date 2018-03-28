import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RoomEmits } from "./RoomEmits";

export class RoomEvents {
    private roomEmits: RoomEmits;
    private releaseRoomIdCallBack: (roomId: number) => void;
    public constructor(roomEmits: RoomEmits, releaseRoomIdCallBack: (roomId: number) => void) {
        this.roomEmits = roomEmits;
        this.releaseRoomIdCallBack = releaseRoomIdCallBack;
    }

    public addMember(playerDataForClient: PlayerDataForClient) {
        this.roomEmits.addMemberEmit(playerDataForClient);
    }
    public deleteMember(playerDataForClient: PlayerDataForClient) {
        this.roomEmits.deleteMemberEmit(playerDataForClient);
    }
    public updatePlayFlag(playFlagDataForClient: PlayFlagDataForClient) {
        this.roomEmits.updatePlayFlagEmit(playFlagDataForClient);
    }
    public deleteRoom(roomId: number) {
        this.roomEmits.deleteRoomEmit(roomId);
        this.releaseRoomIdCallBack(roomId);
    }
}
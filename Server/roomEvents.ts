import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RoomEmits } from "./RoomEmits";
import { RoomDataForClient } from "../Share/roomDataForClient";

export class RoomEvents {
    private roomEmits: RoomEmits;
    private releaseRoomIdCallBack: (roomId: number) => void;
    private releaseUuidCallBack: (uuid: string) => void;

    public constructor(roomEmits: RoomEmits,
        releaseRoomIdCallBack: (roomId: number) => void,
        releaseUuidCallBack: (uuid: string) => void) {
        this.roomEmits = roomEmits;
        this.releaseRoomIdCallBack = releaseRoomIdCallBack;
        this.releaseUuidCallBack = releaseUuidCallBack;
    }

    public addMember(playerDataForClient: PlayerDataForClient) {
        this.roomEmits.addMemberEmit(playerDataForClient);
    }
    public deleteMember(playerDataForClient: PlayerDataForClient, uuid: string) {
        this.roomEmits.deleteMemberEmit(playerDataForClient);
        this.releaseUuidCallBack(uuid);
    }
    public updatePlayFlag(playFlagDataForClient: PlayFlagDataForClient) {
        this.roomEmits.updatePlayFlagEmit(playFlagDataForClient);
    }
    public addRoom(roomData: RoomDataForClient) {
        this.roomEmits.addRoomEmit(roomData);
    }
    public deleteRoom(roomId: number) {
        this.roomEmits.deleteRoomEmit(roomId);
        this.releaseRoomIdCallBack(roomId);
    }
}
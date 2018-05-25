import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";
import { RoomDataForClient } from "../Share/roomDataForClient";

export interface RoomListEvents {
    addMemberCallBack: (playerDataForClient: PlayerDataForClient) => void;
    deleteMemberCallBack: (playerDataForClient: PlayerDataForClient) => void;
    deleteRoomCallBack: (roomId: number) => void;
    updatePlayFlagCallBack: (playFlagDataForClient: PlayFlagDataForClient) => void;
    addRoomCallBack: (roomDataForClient: RoomDataForClient) => void;
}
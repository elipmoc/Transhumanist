import { PlayerDataForClient } from "../Share/playerDataForClient";
import { PlayFlagDataForClient } from "../Share/playFlagDataForClient";

export type RoomEvents = {
    addMemberCallBack: (playerDataForClient: PlayerDataForClient) => void
    deleteMemberCallBack: (playerDataForClient: PlayerDataForClient) => void
    updatePlayFlagCallBack: (playFlagDataForClient: PlayFlagDataForClient) => void
    deleteRoomCallBack: (roomId: number) => void
}
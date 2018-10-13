import { PlayerDataForClient } from "../Share/playerDataForClient";

export interface RoomEvents {
    deleteMemberCallBack: (playerDataForClient: PlayerDataForClient, uuid: string) => void;
    deleteRoomCallBack: (roomId: number) => void;
}
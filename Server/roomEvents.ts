import {PlayerDataForClient} from "../Share/playerDataForClient";
export type RoomEvents = {
    addMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void
    deleteMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void
    updateMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void

    deleteRoomCallBack:(roomId:number)=>void
}
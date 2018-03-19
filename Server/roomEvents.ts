import {PlayerDataForClient} from "../Share/playerDataForClient";
export class RoomEvent{
    addMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void
    deleteMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void
    updateMemberCallBack:(playerDataForClient:PlayerDataForClient)=>void

    deleteRoomCallBack:(roomId:number)=>void
}
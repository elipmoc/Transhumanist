import {RoomData} from "../Server/roomData";

export class RoomDataMap{
    private roomDataMap:Map<number,RoomData>;

    addRoomData(roomData:RoomData){}
    deleteRoomData(roomId:number){}
    toArray(){} //返り値 RoomData[]
    getRoomData(roomId:number){} //返り値 RoomData
}
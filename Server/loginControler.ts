import {RoomDataMap} from "../Server/roomDataMap";
import {RoomEvents} from "../Server/roomEvents";
import {RequestCreateRoomData} from "../Share/requestCreateRoomData";
import {RequestEnterRoomData} from "../Share/requestEnterRoomData";

export class LoginControler{
    private roomDataMap:RoomDataMap;
    //private boardControler:BoardControler;
    private roomEvents:RoomEvents;

    //constructor(boardControler:BoardControler,roomEvents:RoomEvents){}
    createRoom(requestCreateRoomData:RequestCreateRoomData){}
    enterRoom(requestEnterRoomData:RequestEnterRoomData){}
    sendRoomList(){}
}
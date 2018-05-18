import { RoomListEvents } from "./roomListEvents";
import { RoomList } from "./roomList";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";

export class RoomControler {
    private roomList: RoomList;

    constructor(roomListEvents: RoomListEvents) {
        this.roomList = new RoomList(roomListEvents);
    }

    isExistUuid(uuid: string) {
        return this.roomList.isExistUuid(uuid);
    }

    sendRoomList() {
        return this.roomList.sendRoomList();
    }

    createRoom(requestCreateRoomData: RequestCreateRoomData) {
        return this.roomList.createRoom(requestCreateRoomData);
    }

    enterRoom(requestEnterRoomData: RequestEnterRoomData) {
        return this.roomList.enterRoom(requestEnterRoomData);
    }

    joinUser(socket: SocketIO.Socket, requestBoardGameJoin: RequestBoardGameJoin) {
        this.roomList.joinUser(socket, requestBoardGameJoin.roomid, requestBoardGameJoin.uuid);
    }

    deleteMember(roomId: number, uuid: string) {
        this.roomList.deleteMember(roomId, uuid);
    }

}
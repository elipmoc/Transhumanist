import { Room } from "./room";
import { RoomIdGenerator } from "./roomIdGenerator";
import { UuidGenerator } from "./uuidGenerator";
import { RoomListEvents } from "./roomListEvents";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import {
    successResultCreateRoomData, faildResultCreateRoomData
} from "../Share/resultCreateRoomData";
import {
    ResultEnterRoomData, faildResultEnterRoomData
} from "../Share/resultEnterRoomData";
import { PasswordInfo } from "./passwordInfo";
import { RoomEvents } from "./roomEvents";
import { SocketBinder } from "./socketBinder";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";

export class RoomList {
    private roomMap: Map<number, Room> = new Map();
    private roomDataList: SocketBinder.BinderList<RoomDataForClient>;
    private roomIdGenerator: RoomIdGenerator = new RoomIdGenerator();
    private uuidGenerator: UuidGenerator = new UuidGenerator();
    private boardSocket: SocketIO.Namespace;


    constructor(boardSocket: SocketIO.Namespace, loginSocketManager: SocketBinder.Namespace) {
        this.roomDataList = new SocketBinder.BinderList<RoomDataForClient>("roomList");
        this.boardSocket = boardSocket;
        loginSocketManager.addSocketBinder(this.roomDataList);
    }

    private bindRoomMap(roomId: number, f: (room: Room) => void) {
        const room = this.roomMap.get(roomId);
        if (room == undefined)
            return false;
        f(room);
        return true;
    }

    isExistUuid(uuid: string) {
        return this.uuidGenerator.isExistUuid(uuid);
    }

    createRoom(req: RequestCreateRoomData) {
        let roomId = this.roomIdGenerator.getRoomId();

        //roomIdがnull
        if (roomId == null)
            return faildResultCreateRoomData("これ以上は部屋が作れません。");

        const passwordInfo = new PasswordInfo(req.password, req.passwordFlag);
        const roomEvents: RoomEvents = {
            deleteMemberCallBack: uuid => {
                this.uuidGenerator.releaseUuid(uuid);
            },
            deleteRoomCallBack: roomId => {
                this.roomIdGenerator.releaseRoomId(roomId);
            },
        };

        const room = new Room(roomId, req.roomName, passwordInfo, roomEvents, this.boardSocket);
        room.onUpdate(() => {
            const idx = this.roomDataList.Value.findIndex(x => x.roomId == room.RoomId);
            if (idx != -1)
                this.roomDataList.setAt(idx, room.getRoomDataForClient());
        });
        this.roomMap.set(roomId, room);
        this.roomDataList.push(room.getRoomDataForClient());
        return successResultCreateRoomData(roomId);
    }

    enterRoom(req: RequestEnterRoomData) {
        let room = this.roomMap.get(req.roomId);

        if (room == undefined)
            //部屋が存在しない
            return faildResultEnterRoomData("この部屋は存在しません。");

        const uuid = this.uuidGenerator.getUuid();
        const result: ResultEnterRoomData = room.enterRoom(req, uuid);
        return result;
    }

    deleteRoom(roomId: number) {
        this.bindRoomMap(roomId, room => room.deleteRoom);
    }

    deleteMember(roomId: number, uuid: string) {
        this.bindRoomMap(roomId, room => room.deleteMember(uuid));
    }

    joinUser(socket: SocketIO.Socket, data: RequestBoardGameJoin) {
        return this.bindRoomMap(data.roomid, room => room.joinUser(socket, data.uuid));
    }

}
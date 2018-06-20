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

export class RoomList {
    private roomMap: Map<number, Room> = new Map();
    private roomIdGenerator: RoomIdGenerator = new RoomIdGenerator();
    private uuidGenerator: UuidGenerator = new UuidGenerator();
    private roomListEvents: RoomListEvents;
    private boardSocket: SocketIO.Namespace;

    constructor(roomListEvents: RoomListEvents, boardSocket: SocketIO.Namespace) {
        this.roomListEvents = roomListEvents;
        this.boardSocket = boardSocket;
    }

    private bindRoomMap(roomId: number, f: (room: Room) => void) {
        const room = this.roomMap.get(roomId);
        if (room == undefined)
            return;
        f(room);
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
            deleteMemberCallBack: (playerDataForClient, uuid) => {
                this.uuidGenerator.releaseUuid(uuid);
                this.roomListEvents.deleteMemberCallBack(playerDataForClient);
            },
            deleteRoomCallBack: (roomId) => {
                this.roomIdGenerator.releaseRoomId(roomId);
                this.roomListEvents.deleteRoomCallBack(roomId);
            },
            updatePlayFlagCallBack: (playFlag) =>
                this.roomListEvents.updatePlayFlagCallBack({ roomId: roomId!, playFlag: playFlag })
        };

        const room = new Room(roomId, req.roomName, passwordInfo, roomEvents, this.boardSocket);
        this.roomMap.set(roomId, room);
        this.roomListEvents.addRoomCallBack(room.getRoomDataForClient());
        return successResultCreateRoomData(roomId);
    }

    enterRoom(req: RequestEnterRoomData) {
        let room = this.roomMap.get(req.roomId);

        if (room == undefined)
            //部屋が存在しない
            return faildResultEnterRoomData("この部屋は存在しません。");

        const uuid = this.uuidGenerator.getUuid();
        const result: ResultEnterRoomData = room.enterRoom(req, uuid);
        if (result.successFlag)
            this.roomListEvents.addMemberCallBack({ roomId: req.roomId, playerId: result.playerId, playerName: req.playerName });
        return result;
    }

    deleteRoom(roomId: number) {
        const room = this.roomMap.get(roomId);
        if (room == undefined)
            return;
        room.deleteRoom();
    }

    deleteMember(roomId: number, uuid: string) {
        this.bindRoomMap(roomId, room => room.deleteMember(uuid));
    }

    sendRoomList() {
        return Array.from(this.roomMap.values()).map(
            x => x.getRoomDataForClient()
        );
    }

    joinUser(socket: SocketIO.Socket, roomId: number, uuid: string) {
        this.bindRoomMap(roomId, room => room.joinUser(socket, uuid));
    }

}
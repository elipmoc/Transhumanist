import { RoomData } from "./roomData";

export class BoardGame {
    private roomData: RoomData;
    constructor(roomData: RoomData) {
    }
    joinUser(socket: SocketIO.Socket, uuid: string) {
    }
}
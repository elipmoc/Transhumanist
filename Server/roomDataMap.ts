import { RoomData } from "../Server/roomData";

export class RoomDataMap {
    private roomDataMap: Map<number, RoomData>;

    constructor() {
        this.roomDataMap = new Map<number, RoomData>();
    }

    addRoomData(roomData: RoomData) {
        this.roomDataMap.set(roomData.getRoomId(), roomData);
    }
    deleteRoomData(roomId: number) {
        this.roomDataMap.delete(roomId);
    }
    toArray() {
        return Array.from(this.roomDataMap.values());
    }
    getRoomData(roomId: number) { return this.roomDataMap.get(roomId); }
}
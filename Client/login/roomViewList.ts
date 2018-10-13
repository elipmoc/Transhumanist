import { RoomDataForClient } from "../../Share/roomDataForClient";
import { RoomView } from "./roomView";

export class RoomViewList {
    private roomViewMap: Map<number, RoomView>;
    private requestEnterCallBack: (roomId: number) => void;

    constructor(requestEnterCallBack: (roomId: number) => void) {
        this.roomViewMap = new Map<number, RoomView>();
        this.requestEnterCallBack = requestEnterCallBack;
    }

    initRoomList(roomDataForClientList: RoomDataForClient[]) {
        Array.from(this.roomViewMap).forEach(x => {
            x[1].deleteRoom();
        });
        this.roomViewMap.clear();
        for (let i = 0; i < roomDataForClientList.length; i++) {
            this.addRoom(roomDataForClientList[i]);
        }
    }
    setRoom(roomData: RoomDataForClient) {
        this.roomViewMap.get(roomData.roomId).setRoom(roomData);
    }
    addRoom(roomDataForClient: RoomDataForClient) {
        const roomView = new RoomView(roomDataForClient);
        roomView.onClickRequestEnter(() => { this.requestEnterCallBack(roomDataForClient.roomId); });

        this.roomViewMap.set(roomDataForClient.roomId, roomView);
    }
    deleteRoom(roomId: number) {
        this.roomViewMap.get(roomId).deleteRoom();
        this.roomViewMap.delete(roomId);
    }
}
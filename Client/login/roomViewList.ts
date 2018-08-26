import { RoomDataForClient } from "../../Share/roomDataForClient";
import { PlayerDataForClient } from "../../Share/playerDataForClient";
import { RoomView } from "./roomView";
import { PlayFlagDataForClient } from "../../Share/playFlagDataForClient";

export class RoomViewList {
    private roomViewMap: Map<number, RoomView>;
    private requestEnterCallBack: (roomId: number) => void;

    constructor(requestEnterCallBack: (roomId: number) => void) {
        this.roomViewMap = new Map<number, RoomView>();
        this.requestEnterCallBack = requestEnterCallBack;
    }

    initRoomList(roomDataForClientList: RoomDataForClient[]) {
        for (let i = 0; i < roomDataForClientList.length; i++) {
            this.addRoom(roomDataForClientList[i]);
        }
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

    addMember(playerData: PlayerDataForClient) {
        this.roomViewMap.get(playerData.roomId).addMember(playerData.playerName, playerData.playerId);
    }
    deleteMember(playerData: PlayerDataForClient) {
        this.roomViewMap.get(playerData.roomId).deleteMember(playerData.playerId);
    }
    updatePlayFlag(playFlagData: PlayFlagDataForClient) {
        this.roomViewMap.get(playFlagData.roomId).setPlayFlag(playFlagData.playFlag);
    }
}
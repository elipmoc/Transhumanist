import { RoomDataForClient } from "../Share/roomDataForClient";
import * as $ from "jquery";

export class RoomView {
    private roomId: number;
    private clickRequestEnterCallBack: () => void;

    constructor(roomDataForClient: RoomDataForClient) {
        this.roomId = roomDataForClient.roomId;
        const trLine1 = $("<tr>");
        const tdRoomName = $("<td>");
        const table = $("<table>");

        table.attr("class", "roomTable");
        table.attr("id", String(roomDataForClient.roomId));

        //テーブル上段
        tdRoomName.text(roomDataForClient.roomName);
        tdRoomName.attr("class", "roomName");
        trLine1.append(tdRoomName);

        const tdInPlayer = $("<td>");
        tdInPlayer.attr("colspan", "4");
        tdInPlayer.text("入室中のプレイヤー");
        trLine1.append(tdInPlayer);
        table.append(trLine1);
        //テーブル下段
        const button = $("<input>");
        button.attr("type", "button");
        button.attr("value", "部屋に入室");
        button.attr("class", "roomInButton button");
        button.click(() => { this.clickRequestEnterCallBack(); });

        const trLine2 = $("<tr>");
        const tdPlayFlag = $("<td>");
        tdPlayFlag.attr("class", "playFlag");
        if (roomDataForClient.playFlag) {
            tdPlayFlag.text("プレイ中");
        }
        else {
            //ここにボタンを追加。
            tdPlayFlag.append(button);
        }
        trLine2.append(tdPlayFlag);

        for (let i = 0; i < 4; i++) {
            const tdPlayerName = $("<td>");
            tdPlayerName.attr("class", `player${i}`);
            if (!(roomDataForClient.playerList.length < i)) {
                tdPlayerName.text(roomDataForClient.playerList[i]);
            }
            trLine2.append(tdPlayerName);
        }
        table.append(trLine2);

        const roomListArea = $("#roomListArea");
        if (roomListArea != null)
            roomListArea.append(table);
    }
    setRoom(roomData: RoomDataForClient) {
        const room = $(`#${this.roomId}`);
        room.attr("id", String(roomData.roomId));
        room.find(".roomName").text(roomData.roomName);
        for (let i = 0; i < 4; i++)
            room.find(`.player${i}`).text("");
        roomData.playerList.forEach((name, id) =>
            room.find(`.player${id}`).text(name)
        );
        const playFlag = room.find(".playFlag");
        playFlag.empty();
        if (roomData.playFlag)
            playFlag.text("プレイ中");
        else {
            const button = $('<input type="button" value="部屋に入室" class="roomInButton button">')
                .click(() => this.clickRequestEnterCallBack());
            playFlag.append(button);
        }
    }

    onClickRequestEnter(callBack: () => void) {
        this.clickRequestEnterCallBack = callBack;
    }

    deleteRoom() {
        let target = document.getElementById(String(this.roomId));
        if (target != null && target.parentNode)
            target.parentNode.removeChild(target);
    }
}
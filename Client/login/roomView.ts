import { RoomDataForClient } from "../../Share/roomDataForClient";
import * as $ from "jquery";

export class RoomView {
    private roomId: number;
    private clickRequestEnterCallBack: () => void;

    constructor(roomDataForClient: RoomDataForClient) {
        this.roomId = roomDataForClient.roomId;

        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let table = document.createElement("table");

        table.setAttribute("class", "roomTable");
        table.setAttribute("id", String(roomDataForClient.roomId));

        //テーブル上段
        td.textContent = roomDataForClient.roomName;
        td.setAttribute("class", "roomName");
        tr.appendChild(td);
        td = document.createElement("td");
        td.setAttribute("colspan", "4");
        td.textContent = "入室中のプレイヤー";
        tr.appendChild(td);
        table.appendChild(tr);
        //テーブル下段
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "部屋に入室");
        button.setAttribute("class", "roomInButton button");
        button.onclick = () => { this.clickRequestEnterCallBack(); };

        tr = document.createElement("tr");
        td = document.createElement("td");
        td.setAttribute("class", "playFlag");
        if (roomDataForClient.playFlag) {
            td.textContent = "プレイ中";
        }
        else {
            //ここにボタンを追加。
            td.appendChild(button);
        }
        tr.appendChild(td);

        for (let i = 0; i < 4; i++) {
            td = document.createElement("td");
            td.setAttribute("class", `player${i}`);
            if (!(roomDataForClient.playerList.length < i)) {
                td.textContent = roomDataForClient.playerList[i];
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);

        let roomListArea = document.getElementById("roomListArea");
        if (roomListArea != null)
            roomListArea.appendChild(table);
    }
    setRoom(roomData: RoomDataForClient) {
        const room = $(`#${this.roomId}`);
        room.attr("id", String(roomData.roomId));
        room.find(".roomName").text(roomData.roomName);
        console.log(roomData.playerList);
        for (let i = 0; i < 4; i++)
            room.find(`.player${i}`).text("");
        roomData.playerList.forEach((name, id) =>
            room.find(`.player${id}`).text(name)
        );
        const playFlag = room.find(".playFlag td");
        playFlag.empty();
        if (roomData.playFlag)
            playFlag.text("プレイ中");
        else {
            $('<input type="button" value="部屋に入室" class="roomInButton button">')
                .click(() => this.clickRequestEnterCallBack());
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
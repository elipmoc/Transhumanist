import {RoomDataForClient} from "../Share/roomDataForClient";

export class RoomView {
    private roomId: number;
    private clickRequestEnterCallBack: () => void;
    
    constructor(roomDataForClient: RoomDataForClient){
        this.roomId = roomDataForClient.roomId;

        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let table = document.createElement("table");
    
        table.setAttribute("class", "roomTable");
        table.setAttribute("id", String(roomDataForClient.roomId));
    
        //テーブル上段
        td.textContent = roomDataForClient.roomName;
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
        button.onclick = () => {this.clickRequestEnterCallBack();};
    
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
            td.setAttribute("class", String(i));
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
    addMember(playerName: string,playerId: number){
        let room = document.getElementById(String(this.roomId))
        if (room != null && room.lastElementChild != null)
            room.lastElementChild.
                getElementsByClassName(String(playerId))[0].textContent = playerName;    
    }
    deleteMember(playerId: number){
        let room = document.getElementById(String(this.roomId));
        if (room != null && room.lastElementChild != null)
            room.lastElementChild.
                getElementsByClassName(String(playerId))[0].textContent = "";
    }
    setPlayFlag(playFlag: boolean){
        let room = document.getElementById(String(this.roomId));
        if (room != null && room.lastElementChild) {
            let target = room.lastElementChild.
                getElementsByClassName("playFlag")[0];
            if (target.children != null) target.textContent = null;
    
            if (playFlag) {
                target.textContent = "プレイ中";
            }
            else {
                let button = document.createElement("input");
                button.setAttribute("type", "button");
                button.setAttribute("value", "部屋に入室");
    
                //ここにボタンを追加。
                target.appendChild(button);
            }
        }
    }
    onClickRequestEnter(callBack: ()=>void){
        this.clickRequestEnterCallBack = callBack;
    }

    deleteRoom(){
        let target = document.getElementById(String(this.roomId));
        if (target != null && target.parentNode)
            target.parentNode.removeChild(target);
    }
}
let RoomData = {
    roomName:"バーチャル控室",
    roomId:114115,
    playFlag:false,
    playerList:["ミライアカリ","輝夜月","シロ","のじゃロリ"]
};

addRoom(RoomData);

//部屋のリストを受け取って画面に表示
function initRoomList(roomDataList){
    
}

//部屋を新規追加
function addRoom(roomData){
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let table = document.createElement("table");

    table.setAttribute("class","roomTable");
    table.setAttribute("id",roomData.roomId);

    //テーブル上段
    td.textContent = roomData.roomName;
    tr.appendChild(td);
    td = document.createElement("td");
    td.setAttribute("colspan","4");
    td.textContent = "入室中のプレイヤー";
    tr.appendChild(td);
    table.appendChild(tr);
　　//テーブル下段
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.setAttribute("class","playFlag");
    td.textContent = roomData.playFlag ? "プレイ中":"ここにボタン";
    tr.appendChild(td);
    
    for(let i = 0;i<4;i++){
        td = document.createElement("td");
        td.setAttribute("class","player" + i);
        td.textContent = roomData.playerList[i];
        tr.appendChild(td);
    }
    table.appendChild(tr);

    document.getElementById("roomListArea").appendChild(table);
}

//部屋を削除
function deleteRoom(roomID){

}

//メンバーを追加(playerTagはclass =”player1”等の部分)
function addMember(playerName,playerTag){

}

//メンバーを削除(playerTagはclass =”player1”等の部分)
function addMember(playerTag){

}

//プレイ中かどうかが変更
function updatePlayFlag(playFlag){

}
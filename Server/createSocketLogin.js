"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let testRoomDataList = [
    {
        roomName: "バーチャル控室",
        roomId: 114514,
        playFlag: true,
        playerList: ["ミライアカリ", "輝夜月", "シロ", "のじゃロリ"]
    },
    {
        roomName: "テスト用収容室",
        roomId: 666,
        playFlag: false,
        playerList: ["何もない"]
    },
    {
        roomName: "なんでもいい",
        roomId: 10,
        playFlag: false,
        playerList: ["A", "B", "C"]
    }
];
//メインソケットからサンプルソケットを生成
function create(mainSocket) {
    let loginSocket = mainSocket.of("/login");
    //クライアントが繋がった時の処理
    loginSocket.on("connection", (socket) => {
        //requestRoomList + sendRoomList
        socket.on("requestRoomList", data => {
            if (data == null) {
                socket.emit("sendRoomList", JSON.stringify(testRoomDataList));
            }
        });
        //addRoom
        socket.emit("addRoom", JSON.stringify({
            roomName: "serverTest",
            roomId: 300,
            playFlag: false,
            playerList: ["add", "delete", "mad", "うける"]
        }));
        //deleteRoom
        socket.emit("deleteRoom", 10);
        //addMember
        socket.emit("addMember", JSON.stringify({
            roomID: 666,
            playerName: "静かなオーケストラ",
            playerTag: "player1"
        }));
        //deleteMember
        socket.emit("deleteMember", JSON.stringify({
            roomID: 114514,
            playerTag: "player0"
        }));
        //updatePlayFlag
        socket.emit("updatePlayFlag", JSON.stringify({
            roomID: 666,
            playFlag: true
        }));
    });
    return loginSocket;
}
exports.create = create;

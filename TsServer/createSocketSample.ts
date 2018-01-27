
//メインソケットからサンプルソケットを生成
export function create(mainSocket: SocketIO.Server) {
    let sampleSocket = mainSocket.of("/login");
    //クライアントが繋がった時の処理
    sampleSocket.on("connection", (socket: SocketIO.Socket) => {
        //hogeEventでhello!!を送信
        //socket.emit("hogeEvent", "hello!!");
        //socket.on("testBtn",function(date){console.log(date)});

        //addRoom
        socket.emit("addRoom",JSON.stringify({
            roomName: "serverTest",
            roomId: 300,
            playFlag: false,
            playerList: ["add", "delete", "mad","うける"]
        }));

        //deleteRoom
        socket.emit("deleteRoom",10);

        //addMember
        socket.emit("addMember",JSON.stringify({
            roomID: 666,
            playerName: "静かなオーケストラ",
            playerTag: "player1"
        }));

        //deleteMember
        socket.emit("deleteMember",JSON.stringify({
            roomID: 114514,
            playerTag: "player0"
        }));

        //updatePlayFlag
        socket.emit("updatePlayFlag",JSON.stringify({
            roomID: 666,
            playFlag: true
        }));
    });
    return sampleSocket;
}
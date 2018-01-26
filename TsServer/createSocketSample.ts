
//メインソケットからサンプルソケットを生成
export function create(mainSocket: SocketIO.Server) {
    let sampleSocket = mainSocket.of("/sample");
    //クライアントが繋がった時の処理
    sampleSocket.on("connection", (socket: SocketIO.Socket) => {
        //hogeEventでhello!!を送信
        socket.emit("hogeEvent", "hello!!");
    });
    return sampleSocket;
}
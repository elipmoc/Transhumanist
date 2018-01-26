"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//メインソケットからサンプルソケットを生成
function create(mainSocket) {
    let sampleSocket = mainSocket.of("/sample");
    //クライアントが繋がった時の処理
    sampleSocket.on("connection", (socket) => {
        //hogeEventでhello!!を送信
        socket.emit("hogeEvent", "hello!!");
    });
    return sampleSocket;
}
exports.create = create;

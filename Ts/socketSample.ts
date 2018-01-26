import * as io from "socket.io-client";

//サンプルソケットに繋げる
const socket = io("/sample");

//hogeEventとしてデータの受信処理
socket.on("hogeEvent", (data: string) => {
    document.write(data)
});
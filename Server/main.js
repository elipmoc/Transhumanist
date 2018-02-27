//ライブラリのインポート
const http = require('http');
const myRouter = require('./routing.js');
const io = require("socket.io");

//サーバーの作成
let server = http.createServer();

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//メインソケットを作成
const mainSocket = io(server);
//メインソケットからログインソケットを作成
const loginSocket = require("./loginSocket.js").create(mainSocket);

//サーバーポート設定
server.listen(3000);

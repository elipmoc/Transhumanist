//ライブラリのインポート
import * as http from 'http';
const myRouter = require('./routing.js');
import * as io from "socket.io";

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

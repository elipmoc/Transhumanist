//ライブラリのインポート
const http = require('http');
const myRouter = require('./routing.js');
const io = require("socket.io");

//サーバーの作成
let server = http.createServer();
const socket = io(server);

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//サーバーポート設定
server.listen(3000);

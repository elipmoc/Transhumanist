//ライブラリのインポート
const http = require('http');
const myRouter = require('./routing.js');
const io = require("socket.io");
const createSocketLogin = require("./createSocketLogin.js");

//サーバーの作成
let server = http.createServer();

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//メインソケットを作成
const mainSocket = io(server);
//メインソケットからログインソケットを作成
let socketLogin = createSocketLogin.create(mainSocket);

//サーバーポート設定
server.listen(3000);

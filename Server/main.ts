//ライブラリのインポート
import * as http from 'http';
const myRouter = require('./routing.js');
import * as io from "socket.io";
import {LoginSocket} from "../Server/loginSocket";
import {LoginControler} from "../Server/loginControler";

//サーバーの作成
let server = http.createServer();

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//メインソケットを作成
const mainSocket = io(server);
//メインソケットからログインソケットを作成
const loginControler = new LoginControler;
const loginSocket = new LoginSocket(mainSocket,loginControler);

//サーバーポート設定
server.listen(3000);

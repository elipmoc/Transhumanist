//ライブラリのインポート
import * as http from 'http';
const myRouter = require('./routing.js');
import * as io from "socket.io";
import {LoginControler} from "../Server/loginControler";
import {LoginSocket} from "../Server/loginSocket";
import {BoardControler} from "../Server/boardControler";
import {BoardSocket} from "../Server/boardSocket";

//サーバーの作成
let server = http.createServer();

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//メインソケットを作成
const mainSocket = io(server);
//メインソケットからログインソケットを作成
const boardControler = new BoardControler;

const loginControler = new LoginControler(boardControler,);

const loginSocket = new LoginSocket(mainSocket,loginControler);
const boardSocket = new BoardSocket(mainSocket,boardControler);

//サーバーポート設定
server.listen(3000);

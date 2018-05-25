//ライブラリのインポート
import * as http from 'http';
import { createRouter } from "./routing";
import * as io from "socket.io";
import { createControler } from "../Server/createControler";


//サーバーの作成
let server = http.createServer();

//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", createRouter());
//メインソケットを作成
const mainSocket = io(server);
createControler(mainSocket);
//サーバーポート設定
server.listen(process.env.PORT || 3000);

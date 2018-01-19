//ライブラリのインポート
const http = require('http');
const myRouter = require('./routing.js');

//サーバーの作成
let server = http.createServer();
//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", myRouter.createRouter());
//サーバーポート設定
server.listen(3000);

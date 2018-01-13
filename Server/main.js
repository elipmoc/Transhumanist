//ライブラリのインポート
var http = require('http');
var fs = require('fs');

//サーバーの作成
let server = http.createServer();
//サーバーにクライアントがリクエストした時に呼ばれる関数を設定
server.on("request", routing);
//サーバーポート設定
server.listen(3000);

//ルーティングをして適切にデータをクライアントに送信
function routing(req, res) {
    switch (req.url) {
        case "/":
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(fs.readFileSync("./Html/login.html"));
            break;
        case "/Css/login.css":
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.end(fs.readFileSync("./Css/login.css"));
            break;
        case "/Css/board.css":
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.end(fs.readFileSync("./Css/board.css"));
            break;
        default:
            res.end("not find url " + req.url);
            break;
    }
}
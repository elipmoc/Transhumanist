//ライブラリのインポート
const http = require('http');
const fs = require('fs');

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
            sendHtml(res, "./Html/login.html");
            break;
        case "/Css/login.css":
            sendCss(res, "./Css/login.css");
            break;
        case "/Css/board.css":
            sendCss(res, "./Css/board.css");
            break;
        case "/board.html":
            sendHtml(res, "./Html/board.html");
            break;
        case "/Js/Lib/enchant.js":
            sendJs(res, "./Js/Lib/enchant.js");
            break;
        case "/Js/board.js":
            sendJs(res, "./Js/board.js");
            break;
        default:
            res.end("not find url " + req.url);
            break;
    }
}

function sendHtml(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync(path));
}

function sendCss(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync(path));
}

function sendJs(res, path) {
    res.writeHead(200, {
        'Content-Type': 'text/plane'
    });
    res.end(fs.readFileSync(path));
}
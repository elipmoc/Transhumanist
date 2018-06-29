const fs = require('fs');
const router = require('router');
const finalhandler = require('finalhandler');

export function createRouter() {
    let myRouter = router();
    myRouter.get("/", (req: any, res: any) => {
        sendHtml(res, "./Html/login.html");
    });
    myRouter.get("/Client/Lib/easel.js", (req: any, res: any) => {
        sendHtml(res, "./Client/Lib/easeljs-0.8.2.min.js");
    });
    myRouter.get("/Client/Lib/preload.js", (req: any, res: any) => {
        sendHtml(res, "./Client/Lib/preloadjs-0.6.2.min.js");
    });
    myRouter.get("/Css/:path", (req: any, res: any) => {
        sendCss(res, "./Css/" + req.params.path);
    });
    myRouter.get("/Client/:path", (req: any, res: any) => {
        sendJs(res, "./dist/Client/" + req.params.path);
    });
    myRouter.get("/Img/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/" + req.params.path);
    });
    myRouter.get("/Img/ui/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/ui/" + req.params.path);
    });
    myRouter.get("/Img/page/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/page/" + req.params.path);
    });
    myRouter.get("/Img/background/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/background/" + req.params.path);
    });
    myRouter.get("/Img/card/back/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/card/back/" + req.params.path);
    });
    myRouter.get("/:path", (req: any, res: any) => {
        sendHtml(res, "./Html/" + req.params.path);
    });

    return (req: any, res: any) => {
        myRouter(req, res, finalhandler(req, res));
    }
}

function sendHtml(res: any, path: string) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync(path));
}

function sendCss(res: any, path: string) {
    res.writeHead(200, {
        'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync(path));
}

function sendJs(res: any, path: string) {
    res.writeHead(200, {
        'Content-Type': 'text/plane'
    });
    res.end(fs.readFileSync(path));
}
function sendPng(res: any, path: string) {
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(fs.readFileSync(path));
}
import { yamlGet } from "./yamlGet";
import * as fs from "fs";
const router = require('router');
const finalhandler = require('finalhandler');

export function createRouter() {
    let myRouter = router();
    myRouter.get("/", (req: any, res: any) => {
        sendHtml(res, "./Html/login.html");
    });
    myRouter.get("/Client/Lib/:path", (req: any, res: any) => {
        sendHtml(res, "./Client/Lib/" + req.params.path);
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
    myRouter.get("/Bgm/:path", (req: any, res: any) => {
        sendMp3(res, "./Resource/Bgm/" + req.params.path);
    });
    myRouter.get("/Se/:path", (req: any, res: any) => {
        sendMp3(res, "./Resource/Se/" + req.params.path);
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
    myRouter.get("/Img/card/front/action/:path", (req: any, res: any) => {
        sendPng(res, "./Resource/Img/card/front/action/" + req.params.path);
    });
    myRouter.get("/Json/:path", (req: any, res: any) => {
        sendYaml(res, "./Resource/Yaml/" + req.params.path);
    });
    myRouter.get("/:path", (req: any, res: any) => {
        sendHtml(res, "./Html/" + req.params.path);
    });

    return (req: any, res: any) => {
        myRouter(req, res, finalhandler(req, res));
    }
}

function sendHtml(res: any, path: string) {
    readFileResponse(res, path, "text/html");
}

function sendCss(res: any, path: string) {
    readFileResponse(res, path, "text/css");
}

function sendJs(res: any, path: string) {
    readFileResponse(res, path, "text/plane");
}
function sendPng(res: any, path: string) {
    readFileResponse(res, path, "image/png");
}
function sendYaml(res: any, path: string) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(yamlGet(path)));
}

function sendMp3(res: any, path: string) {
    readFileResponse(res, path, "audio/mp3");
}

function readFileResponse(res: any, path: string, contentType: string) {
    fs.readFile(path, (_, data) => {
        res.writeHead(200, {
            'Content-Type': contentType
        });
        res.end(data);
    });
}
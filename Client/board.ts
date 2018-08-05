import * as global from "./boardGlobalData"
import * as view from "./boardView/view"
import * as io from "socket.io-client";
import * as viewBuilder from "./boardView/viewBuilder"
import * as cookies from "js-cookie";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";
import { OptionWindow } from "./boardView/optionWindow";
import { TopWindowL } from "./boardView/topWindowL";

const queue = new createjs.LoadQueue();
window.onload = () => {

    queue.on("complete", preloadImage);
    queue.loadManifest([
        { id: "evenPlayerFrame", src: "Img/ui/evenPlayerFrame.png" },
        { id: "evenPlayerFrame2", src: "Img/ui/evenPlayerFrame2.png" },
        { id: "oddPlayerFrame", src: "Img/ui/oddPlayerFrame.png" },
        { id: "oddPlayerFrame2", src: "Img/ui/oddPlayerFrame2.png" },
        { id: "topWindows", src: "Img/ui/topWindows.png" },
        { id: "setting", src: "Img/ui/setting.png" },
        { id: "evenPlayerRBArea", src: "Img/ui/evenPlayerRBArea.png" },
        { id: "oddPlayerRBArea", src: "Img/ui/oddPlayerRBArea.png" },
        { id: "logEvent", src: "Img/ui/logEvent.png" },
        { id: "button", src: "Img/ui/button.png" },
        { id: "actionStorageFrame", src: "Img/ui/actionStorageFrame.png" },
        { id: "optionWindow", src: "Img/ui/optionWindow.png" },
        { id: "optionCross", src: "Img/ui/optionCross.png" },
        { id: "optionVolumeBar", src: "Img/ui/optionVolumeBar.png" },
        { id: "optionVolumeCursor", src: "Img/ui/optionVolumeCursor.png" },
        { id: "b_level1", src: "Img/card/back/level1mb.png" },
        { id: "b_level2", src: "Img/card/back/level2mb.png" },
        { id: "b_level3", src: "Img/card/back/level3mb.png" },
        { id: "b_level4", src: "Img/card/back/level4mb.png" },
        { id: "b_level5", src: "Img/card/back/level5mb.png" },
        { id: "b_level6", src: "Img/card/back/level6mb.png" },
        { id: "f_level1", src: "Img/card/front/action/level1.png" },
        { id: "f_level2", src: "Img/card/front/action/level2.png" },
        { id: "f_level3", src: "Img/card/front/action/level3.png" },
        { id: "f_level4", src: "Img/card/front/action/level4.png" },
        { id: "f_level5", src: "Img/card/front/action/level5.png" },
        { id: "f_level6", src: "Img/card/front/action/level6.png" },
        { id: "miningAction", src: "Img/card/front/action/mining.png" },
        { id: "意識操作のテスト", src: "Img/card/front/action/意識操作のテスト.png" },
        { id: "核融合炉", src: "Img/card/front/action/核融合炉.png" },
        { id: "量子コンピュータ", src: "Img/card/front/action/量子コンピュータ.png" },
        { id: "resource", src: "Img/resource.png" },
        { id: "buildAction", src: "Img/buildAction.png" },
        { id: "logFrame", src: "Img/ui/logFrame.png" },
        { id: "eventFrame", src: "Img/ui/eventFrame.png" },
        { id: "bg_level1", src: "Img/background/bg_level1.png" },
        { id: "bg_level2", src: "Img/background/bg_level2.png" },
        { id: "bg_level3", src: "Img/background/bg_level3.png" },
        { id: "bg_level4", src: "Img/background/bg_level4.png" },
        { id: "bg_level5", src: "Img/background/bg_level5.png" },
        { id: "bg_level6", src: "Img/background/bg_level6.png" }
    ]);
}

function preloadImage() {
    let stage = new createjs.Stage("myCanvas");
    stage.enableMouseOver();
    let background = new createjs.Bitmap(queue.getResult("bg_level4"));
    background.alpha = 0.5;
    stage.addChild(background);

    //オプションウインドウ
    const optionWindow = new OptionWindow(queue);
    optionWindow.x = global.canvasWidth / 2;
    optionWindow.y = global.canvasHeight / 2;
    optionWindow.visible = false;

    //左上のやつ生成
    stage.addChild(new TopWindowL(queue, optionWindow));


    //イベント枠
    let topWindowsR = new createjs.Bitmap(queue.getResult("topWindows"));
    topWindowsR.scaleX = -1;
    topWindowsR.x = global.canvasWidth;
    stage.addChild(topWindowsR);

    const socket = io("/board");

    const requestBoardGameJoin: RequestBoardGameJoin = { uuid: cookies.get("uuid"), roomid: Number(cookies.get("roomid")) };
    socket.emit("joinBoardGame", JSON.stringify(requestBoardGameJoin));

    viewBuilder.viewBuilder({ queue: queue, stage: stage, socket: socket, playerId: Number(cookies.get("playerId")) });

    stage.addChild(optionWindow);
    stage.update();
}
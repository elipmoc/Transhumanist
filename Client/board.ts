import * as global from "./boardGlobalData"
import * as view from "./boardView/view"
import * as io from "socket.io-client";
import * as viewBuilder from "./boardView/viewBuilder"
import * as cookies from "js-cookie";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";
import { OptionWindow } from "./boardView/optionWindow";

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
        { id: "handTest", src: "Img/ui/handTest.png" },
        { id: "optionWindow", src: "Img/ui/optionWindow.png" },
        { id: "optionCross", src: "Img/ui/optionCross.png" },
        { id: "optionVolumeBar", src: "Img/ui/optionVolumeBar.png" },
        { id: "optionVolumeCursor", src: "Img/ui/optionVolumeCursor.png" },
        { id: "level1", src: "Img/card/back/level1mb.png" },
        { id: "level2", src: "Img/card/back/level2mb.png" },
        { id: "level3", src: "Img/card/back/level3mb.png" },
        { id: "level4", src: "Img/card/back/level4mb.png" },
        { id: "level5", src: "Img/card/back/level5mb.png" },
        { id: "level6", src: "Img/card/back/level6mb.png" },
        { id: "resource", src: "Img/resource.png" },
        { id: "buildAction", src: "Img/buildAction.png" },
        { id: "logFrame", src: "Img/ui/logFrame.png" },
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

    //設定枠
    let topWindowsL = new createjs.Bitmap(queue.getResult("topWindows"));
    stage.addChild(topWindowsL);
    //設定ボタン
    const settingButton = new view.SettingButton(() => { optionWindow.visible = true; stage.update(); }, queue);
    settingButton.x = (topWindowsL.image.height - settingButton.getHeight()) / 2;
    settingButton.y = (topWindowsL.image.height - settingButton.getHeight()) / 2;
    stage.addChild(settingButton);

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
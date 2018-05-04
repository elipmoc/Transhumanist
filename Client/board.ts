import * as global from "./boardGlobalData"
import * as view from "./view"
import * as io from "socket.io-client";
import * as viewBuilder from "./viewBuilder"
import { SelectActionWindow } from "./selectActionWindow"

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
        { id: "resource", src: "Img/resource.png" }
    ]);
}

function preloadImage() {
    let stage = new createjs.Stage("myCanvas");
    let background = new createjs.Shape();
    background.graphics.beginFill("black").
        drawRect(0, 0, global.canvasWidth, global.canvasHeight);
    stage.addChild(background);

    //プレイヤー1のリソース
    let player1resourceArea = new view.Player1Resource(queue);
    stage.addChild(player1resourceArea);
    //プレイヤー1の設置アクション
    let player1buildArea = new view.Player1Build(queue);
    stage.addChild(player1buildArea);

    //プレイヤー2のリソース
    let player2resourceArea = new view.Player2Resource(queue);
    stage.addChild(player2resourceArea);
    //プレイヤー2の設置アクション
    let player2buildArea = new view.Player2Build(queue);
    stage.addChild(player2buildArea);

    //プレイヤー3のリソース
    let player3resourceArea = new view.Player3Resource(queue);
    stage.addChild(player3resourceArea);
    //プレイヤー3の設置アクション
    let player3buildArea = new view.Player3Build(queue);
    stage.addChild(player3buildArea);

    //プレイヤー4のリソース
    let player4resourceArea = new view.Player4Resource(queue);
    stage.addChild(player4resourceArea);
    //プレイヤー4の設置アクション
    let player4buildArea = new view.Player4Build(queue);
    stage.addChild(player4buildArea);

    //オプションウインドウ
    const optionWindow = new view.OptionWindow(queue);
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

    viewBuilder.viewBuilder({ queue: queue, stage: stage, socket: socket });

    stage.addChild(optionWindow);
    stage.update();
}
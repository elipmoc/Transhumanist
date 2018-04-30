import * as global from "./boardGlobalData"
import * as view from "./view"

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

    //ターン終了ボタン
    let turnFinishButton = new view.TurnFinishButton(() => alert("ターン終了!"), queue);
    stage.addChild(turnFinishButton);

    //宣戦布告ボタン
    const declareWarButton = new view.DeclareWarButton(() => alert("宣戦布告!"), queue);
    stage.addChild(declareWarButton);

    const player1Window = new view.Player1Window(queue);
    player1Window.setPlayerName("輝夜月");
    player1Window.setSpeed(999);
    player1Window.setResource(999);
    player1Window.setActivityRange(999);
    player1Window.setUncertainty(777);
    player1Window.setPositive(999);
    player1Window.setNegative(999);

    const player2Window = new view.Player2Window(queue);
    player2Window.setPlayerName("スーパーひとしくん");
    player2Window.setSpeed(931);
    player2Window.setResource(1919);
    player2Window.setActivityRange(4545);
    player2Window.setUncertainty(721);
    player2Window.setPositive(893);
    player2Window.setNegative(801);

    const player3Window = new view.Player3Window(queue);
    player3Window.setPlayerName("イキリオタク");
    player3Window.setSpeed(99);
    player3Window.setResource(99);
    player3Window.setActivityRange(99);
    player3Window.setUncertainty(99);
    player3Window.setPositive(999);
    player3Window.setNegative(999);

    const player4Window = new view.Player4Window(queue);
    player4Window.setPlayerName("いなむ");
    player4Window.setSpeed(93);
    player4Window.setResource(9);
    player4Window.setActivityRange(9);
    player4Window.setUncertainty(9);
    player4Window.setPositive(88);
    player4Window.setNegative(44);

    stage.addChild(player1Window);
    stage.addChild(player2Window);
    stage.addChild(player3Window);
    stage.addChild(player4Window);
    stage.addChild(optionWindow);
    stage.update();
}
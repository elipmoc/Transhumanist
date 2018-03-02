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
        { id: "handTest", src: "Img/ui/handTest.png" }
    ]);
}

function preloadImage() {
    let stage = new createjs.Stage("myCanvas");
    let background = new createjs.Shape();
    background.graphics.beginFill("black").
        drawRect(0, 0, global.canvasWidth, global.canvasHeight);
    stage.addChild(background);

    //プレイヤー1の設置アクション
    let player1buildArea = new createjs.Bitmap(queue.getResult("oddPlayerRBArea"));
    player1buildArea.regX = player1buildArea.image.width / 2;
    player1buildArea.regY = player1buildArea.image.height;
    player1buildArea.x = global.canvasWidth / 2;
    player1buildArea.y = global.canvasHeight - 85;
    stage.addChild(player1buildArea);
    //プレイヤー1のリソース
    let player1resourceArea = new createjs.Bitmap(queue.getResult("oddPlayerRBArea"));
    player1resourceArea.regX = player1resourceArea.image.width / 2;
    player1resourceArea.regY = player1resourceArea.image.height;
    player1resourceArea.x = global.canvasWidth / 2;
    player1resourceArea.y = player1buildArea.y - player1buildArea.image.height - 4;
    stage.addChild(player1resourceArea);

    //プレイヤー4の枠
    let player4frame = new createjs.Bitmap(queue.getResult("oddPlayerFrame"));
    player4frame.rotation = 180;
    player4frame.regX = player4frame.image.width;
    player4frame.regY = player4frame.image.height / 2;
    player4frame.x = global.canvasWidth - player4frame.image.width;
    player4frame.y = global.canvasHeight / 2;
    stage.addChild(player4frame);

    //設定枠
    let topWindowsL = new createjs.Bitmap(queue.getResult("topWindows"));
    stage.addChild(topWindowsL);
    //設定ボタン
    let setting = new createjs.Bitmap(queue.getResult("setting"));
    setting.x = (topWindowsL.image.height - setting.image.height) / 2;
    setting.y = (topWindowsL.image.height - setting.image.height) / 2;
    stage.addChild(setting);

    //イベント枠
    let topWindowsR = new createjs.Bitmap(queue.getResult("topWindows"));
    topWindowsR.scaleX = -1;
    topWindowsR.x = global.canvasWidth;
    stage.addChild(topWindowsR);

    //ターン終了ボタン
    let turnFinishButton = new createjs.Bitmap(queue.getResult("button"));
    turnFinishButton.regX = turnFinishButton.image.width;
    turnFinishButton.regY = turnFinishButton.image.height;
    turnFinishButton.x = global.canvasWidth - 20;
    turnFinishButton.y = global.canvasHeight - 20;
    stage.addChild(turnFinishButton);
    //ターン終了ボタンテキスト
    let turnFinishText = new createjs.Text("ターン終了", "20px Arial");
    turnFinishText.regX = turnFinishText.getMeasuredWidth() / 2;
    turnFinishText.regY = turnFinishText.getMeasuredHeight() / 2;
    turnFinishText.x = turnFinishButton.x - turnFinishButton.image.width / 2;
    turnFinishText.y = turnFinishButton.y - turnFinishButton.image.height / 2;
    stage.addChild(turnFinishText);

    //宣戦布告ボタン
    let declareWarButton = new createjs.Bitmap(queue.getResult("button"));
    declareWarButton.regX = 0;
    declareWarButton.regY = declareWarButton.image.height;
    declareWarButton.x = 20;
    declareWarButton.y = global.canvasHeight - 20;
    stage.addChild(declareWarButton);

    //宣戦布告ボタンテキスト
    let declareWarText = new createjs.Text("宣戦布告/降伏", "20px Arial");
    declareWarText.regX = declareWarText.getMeasuredWidth() / 2;
    declareWarText.regY = declareWarText.getMeasuredHeight() / 2;
    declareWarText.x = declareWarButton.x + declareWarButton.image.width / 2;
    declareWarText.y = declareWarButton.y - declareWarButton.image.height / 2;
    stage.addChild(declareWarText);

    const player1Window = new view.Player1Window(queue);
    player1Window.setPlayerName("輝夜月");
    player1Window.setSpeed(810);
    player1Window.setResource(10);
    player1Window.setActivityRange(5);
    player1Window.setUncertainty(777);
    player1Window.setPositive(15);
    player1Window.setNegative(30);

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

    stage.addChild(player1Window);
    stage.addChild(player2Window);
    stage.addChild(player3Window);
    stage.update();
}
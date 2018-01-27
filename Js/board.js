/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ({

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const view = __webpack_require__(21);
const queue = new createjs.LoadQueue();
const canvasWidth = 960;
const canvasHeight = 876;
window.onload = () => {
    new view.Player1Window();
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
};
function preloadImage() {
    let stage = new createjs.Stage("myCanvas");
    let background = new createjs.Shape();
    background.graphics.beginFill("black").
        drawRect(0, 0, canvasWidth, canvasHeight);
    stage.addChild(background);
    //プレイヤー1の枠
    let player1frame = new createjs.Bitmap(queue.getResult("evenPlayerFrame"));
    player1frame.regX = player1frame.image.width / 2;
    player1frame.regY = player1frame.image.height;
    player1frame.x = canvasWidth / 2;
    player1frame.y = canvasHeight;
    stage.addChild(player1frame);
    //プレイヤー1の設置アクション
    let player1buildArea = new createjs.Bitmap(queue.getResult("oddPlayerRBArea"));
    player1buildArea.regX = player1buildArea.image.width / 2;
    player1buildArea.regY = player1buildArea.image.height;
    player1buildArea.x = canvasWidth / 2;
    player1buildArea.y = canvasHeight - player1frame.image.height - 4;
    stage.addChild(player1buildArea);
    //プレイヤー1のリソース
    let player1resourceArea = new createjs.Bitmap(queue.getResult("oddPlayerRBArea"));
    player1resourceArea.regX = player1resourceArea.image.width / 2;
    player1resourceArea.regY = player1resourceArea.image.height;
    player1resourceArea.x = canvasWidth / 2;
    player1resourceArea.y = player1buildArea.y - player1buildArea.image.height - 4;
    stage.addChild(player1resourceArea);
    //プレイヤー2の枠
    let player2frame = new createjs.Bitmap(queue.getResult("oddPlayerFrame"));
    player2frame.regY = player2frame.image.height / 2;
    player2frame.y = canvasHeight / 2;
    stage.addChild(player2frame);
    //プレイヤー3の枠
    let player3frame = new createjs.Bitmap(queue.getResult("evenPlayerFrame"));
    player3frame.rotation = 180;
    player3frame.regX = player3frame.image.width / 2;
    player3frame.regY = 0;
    player3frame.x = canvasWidth / 2;
    player3frame.y = player3frame.image.height;
    stage.addChild(player3frame);
    //プレイヤー4の枠
    let player4frame = new createjs.Bitmap(queue.getResult("oddPlayerFrame"));
    player4frame.rotation = 180;
    player4frame.regX = player4frame.image.width;
    player4frame.regY = player4frame.image.height / 2;
    player4frame.x = canvasWidth - player4frame.image.width;
    player4frame.y = canvasHeight / 2;
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
    topWindowsR.x = canvasWidth;
    stage.addChild(topWindowsR);
    //ターン終了ボタン
    let turnFinishButton = new createjs.Bitmap(queue.getResult("button"));
    turnFinishButton.regX = turnFinishButton.image.width;
    turnFinishButton.regY = turnFinishButton.image.height;
    turnFinishButton.x = canvasWidth - 20;
    turnFinishButton.y = canvasHeight - 20;
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
    declareWarButton.y = canvasHeight - 20;
    stage.addChild(declareWarButton);
    //宣戦布告ボタンテキスト
    let declareWarText = new createjs.Text("宣戦布告/降伏", "20px Arial");
    declareWarText.regX = declareWarText.getMeasuredWidth() / 2;
    declareWarText.regY = declareWarText.getMeasuredHeight() / 2;
    declareWarText.x = declareWarButton.x + declareWarButton.image.width / 2;
    declareWarText.y = declareWarButton.y - declareWarButton.image.height / 2;
    stage.addChild(declareWarText);
    stage.update();
}


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//player情報
class PlayerInfo {
}
exports.PlayerInfo = PlayerInfo;
//プレイヤーウインドウ表示のベースクラス
class PlayerWindowBase {
    constructor() { this.negative.color = ""; }
}
exports.PlayerWindowBase = PlayerWindowBase;
class Player1Window extends PlayerWindowBase {
    constructor() {
        super();
        this.negative.color = "";
    }
}
exports.Player1Window = Player1Window;


/***/ })

/******/ });
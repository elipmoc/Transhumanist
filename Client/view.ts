import * as global from "./boardGlobalData"
//player情報
export class PlayerInfo {
    playerName: string;
    speed: number;
    resource: number;
    activityRange: number;
    uncertainty: number;
    positive: number;
    negative: number;
}

//プレイヤーウインドウ表示のベースクラス
export class PlayerWindowBase extends createjs.Container {
    protected playerNameText: createjs.Text;
    protected speedText: createjs.Text;
    protected resourceText: createjs.Text;
    protected activityRange: createjs.Text;
    protected uncertainty: createjs.Text;
    protected positive: createjs.Text;
    protected negative: createjs.Text;
    protected playerFrame: createjs.Bitmap;
    constructor() {
        super();
        this.playerNameText = new createjs.Text();
        this.playerFrame = new createjs.Bitmap("");
        this.speedText = new createjs.Text();
        this.addChild(this.playerFrame);
        this.addChild(this.playerNameText);
        this.addChild(this.speedText);
    }
    //set PlayerInfo(playerInfo: PlayerInfo) {
}

export class Player1Window extends PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();
        this.playerFrame.image = <any>queue.getResult("evenPlayerFrame");
        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = 0;
        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight - this.playerFrame.image.height;
        this.playerNameText.color = "blue";
        this.playerNameText.text = "輝夜月";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.regX = this.playerNameText.getMeasuredWidth() / 2;
        this.playerNameText.x;
        this.playerNameText.y = 5;
        this.speedText.x = -180;
        this.speedText.y = 35;
        this.speedText.color = "white";
        this.speedText.font = "15px Arial";
        this.speedText.text = "処理速度:114514";



    }
}

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
export class PlayerWindowBase {
    protected playerNameText: createjs.Text;
    protected speedText: createjs.Text;
    protected resourceText: createjs.Text;
    protected activityRange: createjs.Text;
    protected uncertainty: createjs.Text;
    protected positive: createjs.Text;
    protected negative: createjs.Text;
    protected playerFrame: createjs.Bitmap;
    constructor() {
        this.playerNameText = new createjs.Text();

    }
    //set PlayerInfo(playerInfo: PlayerInfo) {
}

export class Player1Window extends PlayerWindowBase {
    constructor() {
        super();
        this.negative.color = "";
    }
}
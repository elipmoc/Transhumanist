import { ImageQueue } from "../../imageQueue";

//プレイヤーウインドウ表示のベースクラス
export class PlayerWindowBase extends createjs.Container {
    protected playerNameText: createjs.Text;
    protected speedText: createjs.Text;
    protected resourceText: createjs.Text;
    protected activityRangeText: createjs.Text;
    protected uncertaintyText: createjs.Text;
    protected positiveText: createjs.Text;
    protected negativeText: createjs.Text;
    protected playerFrame: createjs.Bitmap;
    protected gmIcon: createjs.Bitmap;
    private playerFrameImage: HTMLImageElement;
    private myTurnPlayerFrameImage: HTMLImageElement;

    constructor(queue: ImageQueue, playerFrameImageName: string, myTurnPlayerFrameImageName: string) {
        super();
        this.playerFrameImage = <HTMLImageElement>queue.getImage(playerFrameImageName).image;
        this.myTurnPlayerFrameImage = <HTMLImageElement>queue.getImage(myTurnPlayerFrameImageName).image;
        this.playerNameText = new createjs.Text();
        this.playerFrame = new createjs.Bitmap("");
        this.playerFrame.image = this.playerFrameImage;
        this.speedText = new createjs.Text();
        this.resourceText = new createjs.Text();
        this.activityRangeText = new createjs.Text();
        this.uncertaintyText = new createjs.Text();
        this.positiveText = new createjs.Text();
        this.negativeText = new createjs.Text();
        this.gmIcon = queue.getImage("gmIcon");
        this.gmIcon.visible = false;
        this.addChild(this.playerFrame);
        this.addChild(this.playerNameText);
        this.addChild(this.speedText);
        this.addChild(this.resourceText);
        this.addChild(this.activityRangeText);
        this.addChild(this.uncertaintyText);
        this.addChild(this.positiveText);
        this.addChild(this.negativeText);
        this.addChild(this.gmIcon);
    }
    setPlayerName(name: string) {
        this.playerNameText.text = name;
    }
    setSpeed(speed: number) {
        this.speedText.text = "処理速度:" + speed;
    }
    setResource(resource: number) {
        this.resourceText.text = "リソース:" + resource;
    }
    setActivityRange(range: number) {
        this.activityRangeText.text = "活動範囲:" + range;
    }
    setUncertainty(uncertainty: number) {
        this.uncertaintyText.text = "不確定性:" + uncertainty;
    }
    setPositive(positive: number) {
        this.positiveText.text = "Positive:" + positive;
    }
    setNegative(negative: number) {
        this.negativeText.text = "Negative:" + negative;
    }
    visibleGMIcon(flag: boolean) {
        this.gmIcon.visible = flag;
    }
    setMyTurn(flag: boolean) {
        if (flag) {
            this.playerFrame.image = this.myTurnPlayerFrameImage;
        } else {
            this.playerFrame.image = this.playerFrameImage;
        }
    }
}
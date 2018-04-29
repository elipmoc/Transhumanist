//ボタンのベースクラス
export class ButtonBase extends createjs.Container {
    constructor(buttonSource: createjs.DisplayObject, onClickCallback: () => void) {
        super();
        buttonSource.addEventListener("click", () => onClickCallback());
        this.addChild(buttonSource);
    }
}

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
    constructor() {
        super();
        this.playerNameText = new createjs.Text();
        this.playerFrame = new createjs.Bitmap("");
        this.speedText = new createjs.Text();
        this.resourceText = new createjs.Text();
        this.activityRangeText = new createjs.Text();
        this.uncertaintyText = new createjs.Text();
        this.positiveText = new createjs.Text();
        this.negativeText = new createjs.Text();
        this.addChild(this.playerFrame);
        this.addChild(this.playerNameText);
        this.addChild(this.speedText);
        this.addChild(this.resourceText);
        this.addChild(this.activityRangeText);
        this.addChild(this.uncertaintyText);
        this.addChild(this.positiveText);
        this.addChild(this.negativeText);
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
}

//プレイヤーリソース欄のベースクラス
export class PlayerResourceBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: CardIconBase[] = new Array();
    constructor() {
        super();
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        for (let i = 0; i < this.resourceList.length; i++) {
            this.addChild(this.resourceList[i]);
        }
    }
}

//アイコンのベースクラス
export class CardIconBase extends createjs.Bitmap {
    protected icon: createjs.Bitmap;
    protected iconId: number;
    protected event: createjs.MouseEvent;
    constructor() {
        super("");
        this.iconId = 0;
    }
} 
import { CardIconBase, ResourceCardIcon } from "./viewCardIcon"

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
    protected resourceList: ResourceList = new ResourceList;
    constructor() {
        super();
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }
}

//リソースリストのクラス
export class ResourceList extends createjs.Container {
    protected resources: CardIconBase[] = new Array();
    constructor() {
        super();
        for (let i = 0; i < this.resources.length; i++) {
            this.addChild(this.resources[i]);
        }
    }
    addResource(icon: CardIconBase) {
        this.resources.push(icon);
    }
    deleteResource() {

    }
}

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: BuildList = new BuildList;
    constructor() {
        super();
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);

    }
}

//設置アクションリストのクラス
export class BuildList extends createjs.Container {
    protected builds: CardIconBase[] = new Array();
    constructor() {
        super();
        for (let i = 0; i < this.builds.length; i++) {
            this.addChild(this.builds[i]);
        }
    }
    addBuild(icon: CardIconBase) {
        this.builds.push(icon);
    }
    deleteBuild() {

    }
}

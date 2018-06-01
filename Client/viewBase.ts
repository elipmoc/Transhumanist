import { CardIconBase, ResourceCardIcon, BuildActionCardIcon } from "./viewCardIcon"
import { ResourceKind } from "../Share/resourceKind";
import * as global from "./boardGlobalData";
import { BuildActionKind } from "../Share/buildActionKind";

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
export class PlayerResourceAreaBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: IconList<ResourceCardIcon, ResourceKind>;

    //xNum:リソースを横に何個並べるかの数値
    constructor(xNum: number) {
        super();
        this.resourceList = new IconList<ResourceCardIcon, ResourceKind>(xNum, 30, ResourceCardIcon)
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (iconId: number, resourceKind: ResourceKind) => void) {
        this.resourceList.onClickIcon(onClickIconCallBack);
    }

    setResource(iconId: number, resourceKind: ResourceKind, queue: createjs.LoadQueue) {
        this.resourceList.setResource(iconId, resourceKind, queue);
    }
}

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: IconList<BuildActionCardIcon, BuildActionKind>;
    constructor(xNum: number) {
        super();
        this.buildList = new IconList<BuildActionCardIcon, BuildActionKind>(xNum, 30, BuildActionCardIcon);
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);
    }
    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (iconId: number, buildActionKind: BuildActionKind) => void) {
        this.buildList.onClickIcon(onClickIconCallBack);
    }

    setResource(iconId: number, buildActionKind: BuildActionKind, queue: createjs.LoadQueue) {
        this.buildList.setResource(iconId, buildActionKind, queue);
    }
}

//iconリストのクラス
export class IconList<I extends CardIconBase<K>, K extends number> extends createjs.Container {
    protected icons: I[] = new Array();
    private onClickIconCallBack: (iconId: number, kind: K) => void;
    private xNum: number;

    //xNum:iconを横に何個並べるかの数値
    constructor(xNum: number, maxIcon: number, icon_creator: { new(i: number): I; }) {
        super();
        this.xNum = xNum;
        for (let i = 0; i < maxIcon; i++) {
            const cardIcon = new icon_creator(i);
            cardIcon.onClicked((iconId, kind) => this.onClickIconCallBack(iconId, kind));
            cardIcon.x = this.icons.length % this.xNum * global.cardIconSize;
            cardIcon.y = Math.floor(this.icons.length / this.xNum) * global.cardIconSize;
            this.icons.push(cardIcon);
            this.addChild(cardIcon);
        }
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (iconId: number, kind: K) => void) {
        this.onClickIconCallBack = onClickIconCallBack;
    }

    setResource(iconId: number, kind: K, queue: createjs.LoadQueue) {
        this.icons[iconId].setKind(kind, queue);
    }
}
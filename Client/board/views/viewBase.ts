import { CardIconBase, ResourceCardIcon, BuildActionCardIcon } from "./cardIcon"
import * as global from "../../boardGlobalData";
import { ResourceIndex, ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { BuildActionIndex, ActionCardName } from "../../../Share/Yaml/actionCardYamlData";

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
    protected gmIcon: createjs.Bitmap;

    constructor(queue: createjs.LoadQueue) {
        super();
        this.playerNameText = new createjs.Text();
        this.playerFrame = new createjs.Bitmap("");
        this.speedText = new createjs.Text();
        this.resourceText = new createjs.Text();
        this.activityRangeText = new createjs.Text();
        this.uncertaintyText = new createjs.Text();
        this.positiveText = new createjs.Text();
        this.negativeText = new createjs.Text();
        this.gmIcon = new createjs.Bitmap(queue.getResult("gm_icon"));
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
    public visibleGMIcon(flag: boolean) {
        this.gmIcon.visible = flag;
    }
}

//プレイヤーリソース欄のベースクラス
export class PlayerResourceAreaBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: IconList<ResourceCardIcon, ResourceName>;

    //xNum:リソースを横に何個並べるかの数値
    constructor(xNum: number) {
        super();
        this.resourceList = new IconList<ResourceCardIcon, ResourceName>(xNum, 30, ResourceCardIcon)
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (iconId: number, resourceName: ResourceName) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (resouorceName: ResourceName) => void) {
        this.resourceList.onMouseOveredIcon(onMouseOverIconCallBack);
    }

    //リソースアイコンがマウスアウトされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutIconCallBack: () => void) {
        this.resourceList.onMouseOutedIcon(onMouseOutIconCallBack);
    }

    setResource(iconId: number, resourceName: ResourceName, resourceIndex: ResourceIndex, queue: createjs.LoadQueue) {
        this.resourceList.setResource(iconId, resourceName, resourceIndex, queue);
    }
}

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: IconList<BuildActionCardIcon, ActionCardName | null>;
    constructor(xNum: number) {
        super();
        this.buildList = new IconList<BuildActionCardIcon, ActionCardName | null>(xNum, 30, BuildActionCardIcon);
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);
    }
    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (iconId: number, buildActionCardName: ActionCardName) => void) {
        this.buildList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (buildActionCardName: ActionCardName) => void) {
        this.buildList.onMouseOveredIcon(onMouseOverIconCallBack);
    }

    //リソースアイコンがマウスアウトされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutIconCallBack: () => void) {
        this.buildList.onMouseOutedIcon(onMouseOutIconCallBack);
    }

    setResource(iconId: number, buildActionCardName: ActionCardName, buildActionIndex: BuildActionIndex, queue: createjs.LoadQueue) {
        this.buildList.setResource(iconId, buildActionCardName, buildActionIndex, queue);
    }
}

//iconリストのクラス
export class IconList<I extends CardIconBase<K>, K> extends createjs.Container {
    protected icons: I[] = new Array();
    private onClickIconCallBack: (iconId: number, kind: K) => void;
    private onMouseOverIconCallBack: (kind: K) => void;
    private onMouseOutIconCallBack: () => void;
    private xNum: number;

    //xNum:iconを横に何個並べるかの数値
    constructor(xNum: number, maxIcon: number, icon_creator: { new(i: number): I; }) {
        super();
        this.xNum = xNum;
        for (let i = 0; i < maxIcon; i++) {
            const cardIcon = new icon_creator(i);
            cardIcon.onClicked((iconId, kind) => this.onClickIconCallBack(iconId, kind));
            cardIcon.onMouseOuted(() => this.onMouseOutIconCallBack());
            cardIcon.onMouseOvered((kind) => this.onMouseOverIconCallBack(kind));
            cardIcon.x = this.icons.length % this.xNum * global.cardIconSize;
            cardIcon.y = Math.floor(this.icons.length / this.xNum) * global.cardIconSize;
            this.icons.push(cardIcon);
            this.addChild(cardIcon);
        }
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (iconId: number, kind: K) => void) {
        this.onClickIconCallBack = onClickIconCallBack;
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutCallBack: () => void) {
        this.onMouseOutIconCallBack = onMouseOutCallBack;
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (kind: K) => void) {
        this.onMouseOverIconCallBack = onMouseOverIconCallBack;
    }

    setResource(iconId: number, kind: K, imgIndex: number, queue: createjs.LoadQueue) {
        this.icons[iconId].setKind(kind, imgIndex, queue);
    }
}
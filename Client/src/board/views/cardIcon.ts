import { getIconResource } from "../../utility";
import { HaveResourceCard } from "../../Share/haveResourceCard";
import { HaveBuildActionCard } from "../../Share/haveBuildActionCard";
import { ImageQueue } from "../imageQueue";
import { global } from "../../boardGlobalData";

//アイコンのベースクラス
export class CardIconBase<K> extends createjs.Container {
    private kind: K | null;
    private iconId: number;
    private img_name: string;
    protected image: createjs.Bitmap = new createjs.Bitmap("");

    get Kind() { return this.kind; }

    setKind(kind: K | null, imgIndex: number, queue: ImageQueue, iconScale: number) {
        this.kind = kind;
        this.image.image = getIconResource(imgIndex, this.img_name, queue);
        this.image.scaleX = iconScale;
        this.image.scaleY = iconScale;
    }
    get IconId() { return this.iconId; }

    //リソースをクリックされた時に呼ばれる関数
    private onClickCallBack: () => void;

    private onMouseOverCallBack: (kind: K | null) => void;
    //マウスアウトされた時に呼ばれる関数
    private onMouseOutCallBack: () => void;

    private selectFrame: createjs.Shape;

    constructor(iconId: number, kind: K | null, img_name: string) {
        super();
        const iconSize = global.cardIconSize / 2;
        this.selectFrame = new createjs.Shape(new createjs.Graphics().beginStroke("red").drawRect(0, 0, iconSize, iconSize));
        this.selectFrame.visible = false;
        this.addChild(this.image, this.selectFrame);
        this.img_name = img_name;
        this.kind = kind;
        this.iconId = iconId;
        this.addEventListener("click", () => this.onClickCallBack());
        this.addEventListener("mouseover", () => this.onMouseOverCallBack(this.Kind));
        this.addEventListener("mouseout", () => this.onMouseOutCallBack());
    }

    set selectFrameVisible(val: boolean) {
        this.selectFrame.visible = val;
    }
    get selectFrameVisible() {
        return this.selectFrame.visible;
    }

    //クリックされた時に呼ばれる関数を設定
    onClicked(onClickCallBack: () => void) { this.onClickCallBack = onClickCallBack; }

    //マウスオーバーされた時に呼ばれる関数設定
    onMouseOvered(onMouseOverCallBack: (kind: K | null) => void) { this.onMouseOverCallBack = onMouseOverCallBack; }

    //マウスアウトされた時に呼ばれる関数設定
    onMouseOuted(onMouseOutCallBack: () => void) { this.onMouseOutCallBack = onMouseOutCallBack; }
}

//リソースアイコンクラス
export class ResourceCardIcon extends CardIconBase<HaveResourceCard | null> {

    setKind(kind: HaveResourceCard | null, imgIndex: number, queue: ImageQueue, iconScale: number) {
        super.setKind(kind, imgIndex, queue, iconScale);
        if (this.Kind == null) return;
        this.Kind.guardFlag ? this.image.alpha = 0.5 : this.image.alpha = 1;
    }

    constructor(iconId: number) {
        super(iconId, null, "resource");
    }
}

//設置アクションアイコンクラス
export class BuildActionCardIcon extends CardIconBase<HaveBuildActionCard | null> {

    setKind(kind: HaveBuildActionCard | null, imgIndex: number, queue: ImageQueue, iconScale: number) {
        super.setKind(kind, imgIndex, queue, iconScale);
        if (this.Kind == null) return;
        this.Kind.usedFlag ? this.image.alpha = 0.5 : this.image.alpha = 1;
    }

    constructor(iconId: number) {
        super(iconId, null, "buildAction");
    }
}
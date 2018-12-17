import { CardIconBase } from "../cardIcon";
import { global } from "../../../boardGlobalData";
import { ImageQueue } from "../../imageQueue";


//iconリストのクラス
export class IconList<I extends CardIconBase<K>, K> extends createjs.Container {
    protected icons: I[] = new Array();
    private onClickIconCallBack: (cardIcon: CardIconBase<K>) => void;
    private onMouseOverIconCallBack: (kind: K) => void;
    private onMouseOutIconCallBack: () => void;
    private xNum: number;
    private iconScale: number;

    //xNum:iconを横に何個並べるかの数値
    constructor(xNum: number, maxIcon: number, icon_creator: { new(i: number): I; }, iconScale?: number) {
        super();
        this.iconScale = iconScale === undefined ? 0.5 : iconScale;
        this.onClickIconCallBack =
            this.onMouseOverIconCallBack =
            this.onMouseOutIconCallBack = () => { }

        this.xNum = xNum;
        for (let i = 0; i < maxIcon; i++) {
            const cardIcon = new icon_creator(i);
            cardIcon.onClicked(() => this.onClickIconCallBack(cardIcon));
            cardIcon.onMouseOuted(() => this.onMouseOutIconCallBack());
            cardIcon.onMouseOvered((kind) => this.onMouseOverIconCallBack(kind));
            cardIcon.x = this.icons.length % this.xNum * (global.cardIconSize * this.iconScale);
            cardIcon.y = Math.floor(this.icons.length / this.xNum) * (global.cardIconSize * this.iconScale);
            this.icons.push(cardIcon);
            this.addChild(cardIcon);
        }
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (cardIcon: I) => void) {
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

    unSelectFrameVisible() {
        this.icons.forEach(x => x.selectFrameVisible = false);
    }

    getSelectedAllIconId() {
        return this.icons.filter(x => x.selectFrameVisible).map(x => x.IconId);
    }

    setResource(iconId: number, kind: K, imgIndex: number, queue: ImageQueue) {
        this.icons[iconId].setKind(kind, imgIndex, queue, this.iconScale);
    }
}
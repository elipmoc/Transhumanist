import { CardIconBase } from "../cardIcon";
import { global } from "../../../boardGlobalData";
import { ImageQueue } from "../../imageQueue";


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

    setResource(iconId: number, kind: K, imgIndex: number, queue: ImageQueue) {
        this.icons[iconId].setKind(kind, imgIndex, queue);
    }
}
import { ResourceKind } from "../Share/resourceKind";
import { clipBitmap } from "./utility";

//アイコンのベースクラス
export class CardIconBase extends createjs.Bitmap {
    constructor(image: any) {
        super(image);
    }
}

//リソースアイコンクラス
export class ResourceCardIcon extends CardIconBase {
    private resourceKind: ResourceKind;
    private iconId: number;

    //リソースをクリックされた時に呼ばれる関数
    private onClickCallBack: (iconId: number, resourceKind: ResourceKind) => void;

    constructor(iconId: number, resourceKind: ResourceKind, queue: createjs.LoadQueue) {
        const bitmap = clipBitmap(
            new createjs.Bitmap(<any>queue.getResult("resource")),
            resourceKind % 5 * 30,
            Math.floor(resourceKind / 5) * 30,
            30, 30);
        super(bitmap.image);
        this.iconId = iconId;
        this.resourceKind = resourceKind;
        this.iconId = iconId;
        this.addEventListener("click", () => this.onClickCallBack(iconId, resourceKind));
    }

    getResourceKind() { return this.resourceKind; }
    getIconId() { return this.iconId; }

    //クリックされた時に呼ばれる関数を設定
    onClicked(onClickCallBack: (iconId: number, resourceKind: ResourceKind) => void) { this.onClickCallBack = onClickCallBack; }
}
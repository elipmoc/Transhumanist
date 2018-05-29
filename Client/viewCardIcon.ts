import { ResourceKind } from "../Share/resourceKind";
import { clipBitmap } from "./utility";
import * as global from "./boardGlobalData";

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

    private static getIconResource(resourceKind: ResourceKind, queue: createjs.LoadQueue) {
        if (resourceKind == ResourceKind.none)
            return null;
        const bitmap = clipBitmap(
            new createjs.Bitmap(<any>queue.getResult("resource")),
            resourceKind % 5 * global.cardIconSize,
            Math.floor(resourceKind / 5) * global.cardIconSize,
            global.cardIconSize, global.cardIconSize);
        return bitmap.image;
    }

    constructor(iconId: number) {

        super(null);
        this.resourceKind = ResourceKind.none;
        this.iconId = iconId;
        this.addEventListener("click", () => this.onClickCallBack(this.IconId, this.ResourceKind));
    }

    get ResourceKind() { return this.resourceKind; }

    setResourceKind(value: ResourceKind, queue: createjs.LoadQueue) {
        this.resourceKind = value;
        this.image = ResourceCardIcon.getIconResource(value, queue);

    }
    get IconId() { return this.iconId; }

    //クリックされた時に呼ばれる関数を設定
    onClicked(onClickCallBack: (iconId: number, resourceKind: ResourceKind) => void) { this.onClickCallBack = onClickCallBack; }
}
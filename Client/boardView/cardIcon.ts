import { clipBitmap } from "../utility";
import * as global from "../boardGlobalData";
import { ResourceIndex } from "../../Share/Yaml/resourceYamlData";
import { BuildActionIndex } from "../../Share/Yaml/actionCardYamlDataGen";

//アイコンのベースクラス
export class CardIconBase<T extends number> extends createjs.Bitmap {

    private kind: T;
    private iconId: number;
    private img_name: string;

    get Kind() { return this.kind; }

    setKind(value: T, queue: createjs.LoadQueue) {
        this.kind = value;
        this.image = this.getIconResource(value, queue);

    }
    get IconId() { return this.iconId; }

    //リソースをクリックされた時に呼ばれる関数
    private onClickCallBack: (iconId: number, kind: T) => void;

    private hoge() { }
    constructor(image: any, iconId: number, kind: T, img_name: string) {
        super(image);
        this.img_name = img_name;
        this.kind = kind;
        this.iconId = iconId;
        this.addEventListener("click", () => this.onClickCallBack(this.IconId, this.Kind));
    }

    //クリックされた時に呼ばれる関数を設定
    onClicked(onClickCallBack: (iconId: number, kind: T) => void) { this.onClickCallBack = onClickCallBack; }

    private getIconResource(kind: T, queue: createjs.LoadQueue) {
        if (kind == -1)
            return null;
        const bitmap = clipBitmap(
            new createjs.Bitmap(<any>queue.getResult(this.img_name)),
            kind % 5 * global.cardIconSize,
            Math.floor(kind / 5) * global.cardIconSize,
            global.cardIconSize, global.cardIconSize);
        return bitmap.image;
    }
}

//リソースアイコンクラス
export class ResourceCardIcon extends CardIconBase<ResourceIndex> {

    constructor(iconId: number) {
        super(null, iconId, -1, "resource");
    }
}

//設置アクションアイコンクラス
export class BuildActionCardIcon extends CardIconBase<BuildActionIndex> {

    constructor(iconId: number) {
        super(null, iconId, -1, "buildAction");
    }
}
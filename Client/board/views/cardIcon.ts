import { getIconResource } from "../../utility";
import { ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../imageQueue";

//アイコンのベースクラス
export class CardIconBase<K> extends createjs.Bitmap {
    private kind: K | null;
    private iconId: number;
    private img_name: string;

    get Kind() { return this.kind; }

    setKind(kind: K | null, imgIndex: number, queue: ImageQueue) {
        this.kind = kind;
        this.image = getIconResource(imgIndex, this.img_name, queue);

    }
    get IconId() { return this.iconId; }

    //リソースをクリックされた時に呼ばれる関数
    private onClickCallBack: (iconId: number, kind: K | null) => void;

    private onMouseOverCallBack: (kind: K | null) => void;
    //マウスアウトされた時に呼ばれる関数
    private onMouseOutCallBack: () => void;

    constructor(image: any, iconId: number, kind: K | null, img_name: string) {
        super(image);
        this.img_name = img_name;
        this.kind = kind;
        this.iconId = iconId;
        this.addEventListener("click", () => this.onClickCallBack(this.IconId, this.Kind));
        this.addEventListener("mouseover", () => this.onMouseOverCallBack(this.Kind));
        this.addEventListener("mouseout", () => this.onMouseOutCallBack());
    }

    //クリックされた時に呼ばれる関数を設定
    onClicked(onClickCallBack: (iconId: number, kind: K | null) => void) { this.onClickCallBack = onClickCallBack; }

    //マウスオーバーされた時に呼ばれる関数設定
    onMouseOvered(onMouseOverCallBack: (kind: K | null) => void) { this.onMouseOverCallBack = onMouseOverCallBack; }

    //マウスアウトされた時に呼ばれる関数設定
    onMouseOuted(onMouseOutCallBack: () => void) { this.onMouseOutCallBack = onMouseOutCallBack; }
}

//リソースアイコンクラス
export class ResourceCardIcon extends CardIconBase<ResourceName | null> {

    constructor(iconId: number) {
        super(null, iconId, null, "resource");
    }
}

//設置アクションアイコンクラス
export class BuildActionCardIcon extends CardIconBase<ActionCardName | null> {

    constructor(iconId: number) {
        super(null, iconId, null, "buildAction");
    }
}
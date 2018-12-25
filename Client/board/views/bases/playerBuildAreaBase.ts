import { IconList } from "../bases/iconList";
import { BuildActionCardIcon } from "../cardIcon";
import { BuildActionIndex } from "../../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../../imageQueue";
import { HaveBuildActionCard } from "../../../../Share/haveBuildActionCard";

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildAreaBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: IconList<BuildActionCardIcon, HaveBuildActionCard | null>;
    constructor(xNum: number) {
        super();
        this.buildList = new IconList<BuildActionCardIcon, HaveBuildActionCard | null>(xNum, 30, BuildActionCardIcon);
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);
    }
    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (cardicon: BuildActionCardIcon) => void) {
        this.buildList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (buildActionCardData: HaveBuildActionCard) => void) {
        this.buildList.onMouseOveredIcon(onMouseOverIconCallBack);
    }

    //リソースアイコンがマウスアウトされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutIconCallBack: () => void) {
        this.buildList.onMouseOutedIcon(onMouseOutIconCallBack);
    }
    unSelectFrameVisible() {
        this.buildList.unSelectFrameVisible();
    }
    getSelectedAllIconId() {
        return this.buildList.getSelectedAllIconId();
    }
    setResource(iconId: number, buildActionCardData: HaveBuildActionCard, buildActionIndex: BuildActionIndex, queue: ImageQueue) {
        this.buildList.setResource(iconId, buildActionCardData, buildActionIndex, queue);
    }
}
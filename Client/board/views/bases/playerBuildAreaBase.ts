import { IconList } from "../bases/iconList";
import { BuildActionCardIcon } from "../cardIcon";
import { BuildActionIndex } from "../../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../../imageQueue";
import { HaveBuildActionCard } from "../../../../Share/haveBuildActionCard";

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildAreaBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: IconList<BuildActionCardIcon, HaveBuildActionCard | null>;
    //アクションを選択できるモードかどうか
    private selectEnableFlag = false;

    constructor(xNum: number, maxNum: number = 30) {
        super();
        this.buildList = new IconList<BuildActionCardIcon, HaveBuildActionCard | null>(xNum, maxNum, BuildActionCardIcon);
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);
    }

    setSelectEnable() {
        this.selectEnableFlag = true;
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (cardIcon: BuildActionCardIcon) => void) {
        this.buildList.onClickedIcon((cardIcon) => {
            if (this.selectEnableFlag)
                cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
            onClickIconCallBack(cardIcon);
        });
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
        this.selectEnableFlag = false;
        this.buildList.unSelectFrameVisible();
    }
    getSelectedAllIconId() {
        return this.buildList.getSelectedAllIconId();
    }
    setResource(iconId: number, buildActionCardData: HaveBuildActionCard, buildActionIndex: BuildActionIndex, queue: ImageQueue) {
        this.buildList.setResource(iconId, buildActionCardData, buildActionIndex, queue);
    }
}
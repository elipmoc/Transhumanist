import { ResourceCardIcon, CardIconBase } from "../cardIcon";
import { ResourceName, ResourceIndex } from "../../../../Share/Yaml/resourceYamlData";
import { IconList } from "../bases/iconList";
import { ImageQueue } from "../../imageQueue";
import { HaveResourceCard } from "../../../../Share/haveResourceCard";

//プレイヤーリソース欄のベースクラス
export class PlayerResourceAreaBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: IconList<ResourceCardIcon, HaveResourceCard>;

    //xNum:リソースを横に何個並べるかの数値
    constructor(xNum: number, maxNum: number = 30) {
        super();
        this.resourceList = new IconList<ResourceCardIcon, HaveResourceCard>(xNum, maxNum, ResourceCardIcon)
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (cardIcon: ResourceCardIcon) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (resouorceData: HaveResourceCard) => void) {
        this.resourceList.onMouseOveredIcon(onMouseOverIconCallBack);
    }

    //リソースアイコンがマウスアウトされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutIconCallBack: () => void) {
        this.resourceList.onMouseOutedIcon(onMouseOutIconCallBack);
    }

    unSelectFrameVisible() {
        this.resourceList.unSelectFrameVisible();
    }

    getSelectedAllIconId() {
        return this.resourceList.getSelectedAllIconId();
    }

    setResource(iconId: number, resourceData: HaveResourceCard, resourceIndex: ResourceIndex, queue: ImageQueue) {
        this.resourceList.setResource(iconId, resourceData, resourceIndex, queue);
    }
}

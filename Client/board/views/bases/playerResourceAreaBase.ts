import { ResourceCardIcon, CardIconBase } from "../cardIcon";
import { ResourceName, ResourceIndex } from "../../../../Share/Yaml/resourceYamlData";
import { IconList } from "../bases/iconList";
import { ImageQueue } from "../../imageQueue";

//プレイヤーリソース欄のベースクラス
export class PlayerResourceAreaBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: IconList<ResourceCardIcon, ResourceName>;

    //xNum:リソースを横に何個並べるかの数値
    constructor(xNum: number, maxNum: number = 30) {
        super();
        this.resourceList = new IconList<ResourceCardIcon, ResourceName>(xNum, maxNum, ResourceCardIcon)
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (cardIcon: CardIconBase<ResourceName>) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (resouorceName: ResourceName) => void) {
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

    setResource(iconId: number, resourceName: ResourceName, resourceIndex: ResourceIndex, queue: ImageQueue) {
        this.resourceList.setResource(iconId, resourceName, resourceIndex, queue);
    }
}

import { ResourceCardIcon } from "../cardIcon";
import { ResourceName, ResourceIndex } from "../../../../Share/Yaml/resourceYamlData";
import { IconList } from "../bases/iconList";
import { ImageQueue } from "../../imageQueue";

//プレイヤーリソース欄のベースクラス
export class PlayerResourceAreaBase extends createjs.Container {
    protected resourceArea: createjs.Bitmap;
    protected resourceList: IconList<ResourceCardIcon, ResourceName>;

    //xNum:リソースを横に何個並べるかの数値
    constructor(xNum: number) {
        super();
        this.resourceList = new IconList<ResourceCardIcon, ResourceName>(xNum, 30, ResourceCardIcon)
        this.resourceArea = new createjs.Bitmap("");
        this.addChild(this.resourceArea);
        this.addChild(this.resourceList);

    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (iconId: number, resourceName: ResourceName) => void) {
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

    setResource(iconId: number, resourceName: ResourceName, resourceIndex: ResourceIndex, queue: ImageQueue) {
        this.resourceList.setResource(iconId, resourceName, resourceIndex, queue);
    }
}

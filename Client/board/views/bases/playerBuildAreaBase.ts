import { IconList } from "../bases/iconList";
import { BuildActionCardIcon } from "../cardIcon";
import { ActionCardName, BuildActionIndex } from "../../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../../imageQueue";

//プレイヤー設置アクション欄のベースクラス
export class PlayerBuildAreaBase extends createjs.Container {
    protected buildArea: createjs.Bitmap;
    protected buildList: IconList<BuildActionCardIcon, ActionCardName | null>;
    constructor(xNum: number) {
        super();
        this.buildList = new IconList<BuildActionCardIcon, ActionCardName | null>(xNum, 30, BuildActionCardIcon);
        this.buildArea = new createjs.Bitmap("");
        this.addChild(this.buildArea);
        this.addChild(this.buildList);
    }
    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickedIcon(onClickIconCallBack: (iconId: number, buildActionCardName: ActionCardName) => void) {
        this.buildList.onClickedIcon(onClickIconCallBack);
    }

    //リソースアイコンがマウスオーバーされた時に呼ばれる関数をセットする
    onMouseOveredIcon(onMouseOverIconCallBack: (buildActionCardName: ActionCardName) => void) {
        this.buildList.onMouseOveredIcon(onMouseOverIconCallBack);
    }

    //リソースアイコンがマウスアウトされた時に呼ばれる関数をセットする
    onMouseOutedIcon(onMouseOutIconCallBack: () => void) {
        this.buildList.onMouseOutedIcon(onMouseOutIconCallBack);
    }

    setResource(iconId: number, buildActionCardName: ActionCardName, buildActionIndex: BuildActionIndex, queue: ImageQueue) {
        this.buildList.setResource(iconId, buildActionCardName, buildActionIndex, queue);
    }
}
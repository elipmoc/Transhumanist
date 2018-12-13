import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ResourceCardIcon, CardIconBase } from "./cardIcon";
import { ResourceName, ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { IconList } from "./bases/iconList";
import { ImageQueue } from "../imageQueue";
import { CandidateResources } from "../../../Share/candidateResources";

export class SelectResourceWindow extends createjs.Container {
    private resourceNumber: number;
    private maxLength: number;
    private descriptionText = new createjs.Text();
    private cardIndex: number;
    protected resourceList: IconList<ResourceCardIcon, ResourceName>;

    set CardIndex(index: number) {
        this.cardIndex = index;
    }
    get CardIndex() { return this.cardIndex; }

    constructor(maxNum: number) {
        super();
        this.maxLength = maxNum;
        this.resourceList = new IconList<ResourceCardIcon, ResourceName>(this.maxLength, this.maxLength, ResourceCardIcon, 1.0)
        this.resourceList.x = global.canvasWidth / 2 - (global.cardIconSize * this.maxLength) / 2;
        this.resourceList.y = global.canvasHeight / 2 - global.cardIconSize / 2;

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 290;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;


        this.descriptionText.textAlign = "center";
        this.descriptionText.text = "";
        this.descriptionText.font = "20px Bold ＭＳ ゴシック";
        this.descriptionText.color = "white";
        this.descriptionText.shadow = createMyShadow();
        this.descriptionText.x = global.canvasWidth / 2;
        this.descriptionText.y = global.canvasHeight / 2 - 130;

        this.addChild(frame);
        this.addChild(this.resourceList);
        this.addChild(this.descriptionText);
    }

    //リソースを選択する回数設定
    private setNumber(number: number) {
        this.resourceNumber = number;
        this.descriptionText.text = `欲しいリソースを${this.resourceNumber}つ選択してください`;
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (cardIcon: CardIconBase<ResourceName>) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }

    //リソースのセット
    setResource(data: CandidateResources, hash: ResourceHash, imgQueue: ImageQueue) {
        this.resetResource(imgQueue);
        //リソースセット
        data.resource_names.forEach((resourceName, idx) => {
            this.resourceList.setResource(
                idx,
                resourceName,
                resourceName != "" ? hash[resourceName].index : -1,
                imgQueue
            );
        });

        this.resourceList.x =
            global.canvasWidth / 2 - (global.cardIconSize * data.resource_names.length) / 2;

        //ナンバーぶちこみ
        this.setNumber(data.number);
    }

    //リソースの全削除
    private resetResource(queue: ImageQueue) {
        for (let i = 0; this.maxLength > i; i++) {
            this.resourceList.setResource(i, "", -1, queue);
        }
    }
}
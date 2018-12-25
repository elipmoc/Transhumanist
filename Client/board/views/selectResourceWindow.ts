import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ResourceCardIcon } from "./cardIcon";
import { ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { IconList } from "./bases/iconList";
import { ImageQueue } from "../imageQueue";
import { CandidateResources } from "../../../Share/candidateResources";
import { HaveResourceCard } from "../../../Share/haveResourceCard";
import { DecisionButton } from "./decisionButton";

export class SelectResourceWindow extends createjs.Container {
    private resourceNumber: number;
    private maxLength: number;
    private descriptionText = new createjs.Text();
    protected resourceList: IconList<ResourceCardIcon, HaveResourceCard>;
    private button: DecisionButton;
    private buttonCallback: () => void;


    constructor(maxNum: number) {
        super();
        this.maxLength = maxNum;
        this.resourceList = new IconList<ResourceCardIcon, HaveResourceCard>(this.maxLength, this.maxLength, ResourceCardIcon, 1.0)
        this.resourceList.x = global.canvasWidth / 2 - (global.cardIconSize * this.maxLength) / 2;
        this.resourceList.y = global.canvasHeight / 2 - global.cardIconSize / 2;

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 290;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        this.button = new DecisionButton("やめる");
        this.button.x = global.canvasWidth / 2;
        this.button.y = global.canvasHeight / 2 + 90;
        this.button.addEventListener("click", () => this.buttonCallback());
        this.button.visible = false;

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
        this.addChild(this.button);
    }

    //リソースを選択する回数設定
    private setNumber(number: number) {
        this.resourceNumber = number;
        this.descriptionText.text = `欲しいリソースを${this.resourceNumber}つ選択してください`;
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (cardIcon: ResourceCardIcon) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }

    //閉じるボタンの関数
    closeOnClick(f: () => void) {
        this.buttonCallback = f;
        this.button.visible = true;
    }

    //リソースのセット
    setResource(data: CandidateResources, hash: ResourceHash, imgQueue: ImageQueue) {
        this.resetResource(imgQueue);
        //リソースセット
        data.resource_names.forEach((resourceCardName, idx) => {
            this.resourceList.setResource(
                idx,
                { resourceCardName, guardFlag: false },
                resourceCardName != "" ? hash[resourceCardName].index : -1,
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
            this.resourceList.setResource(i, { resourceCardName: "", guardFlag: false }, -1, queue);
        }
    }
}
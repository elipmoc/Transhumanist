import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";
import { DetailsActionCard } from "../detailsActionCard";
import { ActionCardHover } from "../actionCardHover";

//手札カードのクラス
export class HandActionCard extends createjs.Container {
    private cardInfo: DetailsActionCard = new DetailsActionCard(1);
    private yamlData: ActionCardYamlData = null;
    readonly width: number = 84;
    readonly height: number = 126;
    //カードをクリックされた時に呼ばれる関数
    private onClickCallBack: (index: number, cardName: string) => void;
    constructor(index: number, actionCardHover: ActionCardHover, queue: createjs.LoadQueue) {
        super();
        this.addChild(this.cardInfo);

        this.cardInfo.cardFrame.addEventListener("click", () => {
            if (this.yamlData != null)
                this.onClickCallBack(index, this.yamlData.name);
        });
        this.cardInfo.cardFrame.addEventListener("mouseover", () => {
            actionCardHover.setYamlData(this.yamlData, queue);
            actionCardHover.visible = true;
            this.stage.update();
        });
        this.cardInfo.cardFrame.addEventListener("mouseout", () => {
            actionCardHover.setYamlData(null, queue);
            actionCardHover.visible = false;
            this.stage.update();
        });

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.yamlData = yamlData;
        if (yamlData != null) {
            this.cardInfo.setYamlData(yamlData, queue);
            this.cardInfo.visible = true;
        } else {
            //ここは手札がないことを表すので、画像はすべてなくしておく
            this.cardInfo.visible = false;
        }
    }
    get YamlData() { return this.yamlData; }
    setClickCallBack(callback: (index: number, cardName: string) => void) {
        this.onClickCallBack = callback;
    }

}
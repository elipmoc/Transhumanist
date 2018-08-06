import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { MakeCard } from "../../../Client/boardView/makeCard";
import { timingSafeEqual } from "crypto";

//手札カードのクラス
export class ActionStorageCard extends createjs.Container {
    private cardInfo: MakeCard = new MakeCard(1);
    private yamlData: ActionCardYamlData = null;
    private index: number
    readonly width: number = 84;
    readonly height: number = 126;
    //カードをクリックされた時に呼ばれる関数
    private onClickCallBack: (index: number, cardName: string) => void;
    constructor(index: number) {
        super();
        this.index = index;
        this.addChild(this.cardInfo);
        
        this.cardInfo.cardFrame.addEventListener("click", () => {
            if (this.yamlData != null)
                this.onClickCallBack(index, this.yamlData.name);
        });
        this.cardInfo.cardFrame.addEventListener("mouseover", () => { 
            this.stage.update();
        });
        this.cardInfo.cardFrame.addEventListener("mouseout", () => {
            this.stage.update();
        });

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.yamlData = yamlData;
        if (yamlData != null) {
            this.cardInfo.cardFrame.image = new createjs.Bitmap(queue.getResult("f_level" + yamlData.level)).image;
            this.cardInfo.cardImage.image = new createjs.Bitmap(queue.getResult(yamlData.name)).image;
            this.cardInfo.cardName.text = yamlData.name;
            this.cardInfo.cardCap.text = yamlData.description;
            this.cardInfo.cardLevel.text = "LEVEL " + yamlData.level;
            this.cardInfo.cardType.text = yamlData.build_use ? "設置使用" : "使い切り";
        } else {
            //ここは手札がないことを表すので、画像はすべてなくしておく
            this.cardInfo.cardFrame.image = null;
        }
    }
    get YamlData() { return this.yamlData; }
    setClickCallBack(callback: (index: number, cardName: string) => void) {
        this.onClickCallBack = callback;
    }

}
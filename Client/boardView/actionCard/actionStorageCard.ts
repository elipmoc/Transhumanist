import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { timingSafeEqual } from "crypto";

//手札カードのクラス
export class ActionStorageCard extends createjs.Container {
    private cardFrame: createjs.Bitmap;
    private cardImage: createjs.Bitmap;
    private cardName: createjs.Text;
    private cardCap: createjs.Text;
    private cardLevel: createjs.Text;
    private cardType: createjs.Text;
    private yamlData: ActionCardYamlData = null;
    private index: number
    readonly width: number = 84;
    readonly height: number = 126;
    //カードをクリックされた時に呼ばれる関数
    private onClickCallBack: (index: number, cardName: string) => void;
    constructor(index: number) {
        super();
        this.index = index;
        this.cardFrame = new createjs.Bitmap(null);
        this.cardFrame.scaleX = 1 / 3;
        this.cardFrame.scaleY = 1 / 3;
        this.cardImage = new createjs.Bitmap(null);
        this.cardImage.x = 3;
        this.cardImage.y = 26;
        this.cardImage.scaleX = 0.25;
        this.cardImage.scaleY = 0.25;
        this.cardName = new createjs.Text(null);
        this.cardName.textAlign = "center";
        this.cardName.font = "8.5px Arial";
        this.cardName.x = 42;
        this.cardName.y = 5;
        this.cardCap = new createjs.Text(null);
        this.cardCap.x = 4;
        this.cardCap.y = 69;
        this.cardCap.font = "5.4px Arial";
        this.cardCap.lineHeight = 5.4;
        this.cardLevel = new createjs.Text(null);
        this.cardLevel.font = "7px Arial";
        this.cardLevel.x = 4;
        this.cardLevel.y = 17;
        this.cardType = new createjs.Text(null);
        this.cardType.font = "6.4px Arial";
        this.cardType.x = 56;
        this.cardType.y = 17;

        this.addChild(this.cardFrame);
        this.addChild(this.cardImage);
        this.addChild(this.cardName);
        this.addChild(this.cardCap);
        this.addChild(this.cardLevel);
        this.addChild(this.cardType);
        
        this.cardFrame.addEventListener("click", () => {
            if (this.yamlData != null)
                this.onClickCallBack(index, this.yamlData.name);
        });
        this.cardFrame.addEventListener("mouseover", () => { 
            this.stage.update();
        });
        this.cardFrame.addEventListener("mouseout", () => {
            this.stage.update();
        });

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.yamlData = yamlData;
        if (yamlData != null) {
            this.cardFrame.image = new createjs.Bitmap(queue.getResult("f_level" + yamlData.level)).image;
            this.cardImage.image = new createjs.Bitmap(queue.getResult(yamlData.name)).image;
            this.cardName.text = yamlData.name;
            this.cardCap.text = yamlData.description;
            this.cardLevel.text = "LEVEL " + yamlData.level;
            this.cardType.text = yamlData.build_use ? "設置使用" : "使い切り";
        } else {
            //ここは手札がないことを表すので、画像はすべてなくしておく
            this.cardFrame.image = null;
        }
    }
    get YamlData() { return this.yamlData; }
    setClickCallBack(callback: (index: number, cardName: string) => void) {
        this.onClickCallBack = callback;
    }

}
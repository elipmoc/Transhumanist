import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";

//手札カードのクラス
export class ActionStorageCard extends createjs.Container {
    private cardFrame: createjs.Bitmap;
    private cardImage: createjs.Bitmap;
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
        this.addChild(this.cardFrame);
        this.addChild(this.cardImage);
        this.cardFrame.addEventListener("click", () => {
            if (this.yamlData != null)
                this.onClickCallBack(index, this.yamlData.name);
        });
        this.cardFrame.addEventListener("mouseover", () => { 
        });
        this.cardFrame.addEventListener("mouseout", () => {

        });

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.yamlData = yamlData;
        if (yamlData != null) {
            this.cardFrame.image = new createjs.Bitmap(queue.getResult("f_level" + yamlData.level)).image;
            this.cardImage.image = new createjs.Bitmap(queue.getResult(yamlData.name)).image;
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
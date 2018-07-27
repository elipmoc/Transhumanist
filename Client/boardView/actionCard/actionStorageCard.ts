import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";

//手札カードのクラス
export class ActionStorageCard extends createjs.Container {
    private image: createjs.Bitmap;
    private yamlData: ActionCardYamlData = null;
    private index: number
    readonly width: number = 84;
    readonly height: number = 126;
    //カードをクリックされた時に呼ばれる関数
    private onClickCallBack: (index: number, cardName: string) => void;
    constructor(index: number) {
        super();
        this.index = index;
        this.image = new createjs.Bitmap(null);
        this.image.scaleX = 0.5;
        this.image.scaleY = 0.5;
        this.addChild(this.image);
        this.image.addEventListener("click", () => {
            if (this.yamlData != null)
                this.onClickCallBack(index, this.yamlData.name);
        });
    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.yamlData = yamlData;
        if (yamlData != null) {
            this.image.image = new createjs.Bitmap(queue.getResult("miningAction")).image;
        } else { this.image.image = null; }
    }
    get YamlData() { return this.yamlData; }
    setClickCallBack(callback: (index: number, cardName: string) => void) {
        this.onClickCallBack = callback;
    }

}
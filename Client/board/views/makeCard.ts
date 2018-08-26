import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";

export class MakeCard extends createjs.Container {
    cardFrame: createjs.Bitmap;
    private cardImage: createjs.Bitmap;
    private cardName: createjs.Text;
    private cardCap: createjs.Text;
    private cardLevel: createjs.Text;
    private cardType: createjs.Text;
    private size: number;
    width: number;
    height: number;

    constructor(size: number) {
        super();
        this.size = size;
        this.cardFrame = new createjs.Bitmap(null);
        this.cardFrame.scaleX = this.size / 3;
        this.cardFrame.scaleY = this.size / 3;
        this.cardImage = new createjs.Bitmap(null);
        this.cardImage.x = this.size * 2.5;
        this.cardImage.y = this.size * 26;
        this.cardImage.scaleX = this.size * 0.25;
        this.cardImage.scaleY = this.size * 0.25;
        this.cardName = new createjs.Text(null);
        this.cardName.textAlign = "center";
        this.cardName.font = (this.size * 8.5) + "px Arial";
        this.cardName.x = this.size * 42;
        this.cardName.y = this.size * 5;
        this.cardCap = new createjs.Text(null);
        this.cardCap.x = this.size * 4;
        this.cardCap.y = this.size * 69;
        this.cardCap.font = (this.size * 5.4) + "px Arial";
        this.cardCap.lineHeight = this.size * 5.4;
        this.cardLevel = new createjs.Text(null);
        this.cardLevel.font = (this.size * 7) + "px Arial";
        this.cardLevel.x = this.size * 3.5;
        this.cardLevel.y = this.size * 16.5;
        this.cardType = new createjs.Text(null);
        this.cardType.font = (this.size * 6.4) + "px Arial";
        this.cardType.x = this.size * 56;
        this.cardType.y = this.size * 17;

        this.addChild(this.cardFrame);
        this.addChild(this.cardImage);
        this.addChild(this.cardName);
        this.addChild(this.cardCap);
        this.addChild(this.cardLevel);
        this.addChild(this.cardType);
    }

    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        if (yamlData != null) {
            this.cardFrame.image = <any>queue.getResult("f_level" + yamlData.level);
            this.cardImage.image = <any>queue.getResult(yamlData.name);
            this.cardName.text = yamlData.name;
            this.cardCap.text = yamlData.description;
            this.cardLevel.text = "LEVEL " + yamlData.level;
            this.cardType.text = yamlData.build_use ? "設置使用" : "使い切り";
        } else {
            //ここは手札がないことを表すので、画像はすべてなくしておく
            this.cardFrame.image = null;
        }
    }

    setCardSize(size: number) {
        this.size = size;
        this.cardFrame.scaleX = this.size / 3;
        this.cardFrame.scaleY = this.size / 3;
        this.cardImage.x = this.size * 2.5;
        this.cardImage.y = this.size * 26;
        this.cardImage.scaleX = this.size * 0.25;
        this.cardImage.scaleY = this.size * 0.25;
        this.cardName.textAlign = "center";
        this.cardName.font = (this.size * 8.5) + "px Arial";
        this.cardName.x = this.size * 42;
        this.cardName.y = this.size * 5;
        this.cardCap.x = this.size * 4;
        this.cardCap.y = this.size * 69;
        this.cardCap.font = (this.size * 5.4) + "px Arial";
        this.cardCap.lineHeight = this.size * 5.4;
        this.cardLevel.font = (this.size * 7) + "px Arial";
        this.cardLevel.x = this.size * 3.5;
        this.cardLevel.y = this.size * 16.5;
        this.cardType.font = (this.size * 6.4) + "px Arial";
        this.cardType.x = this.size * 56;
        this.cardType.y = this.size * 17;
    }
}
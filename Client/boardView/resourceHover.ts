import * as global from "../boardGlobalData";
import { ResourceYamlData } from "../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../utility";
import { runInThisContext } from "vm";

export class ResourceHover extends createjs.Container {
    //テスト用の画像
    private cardIcon: createjs.Bitmap;
    private cardName: createjs.Text;
    private backGround: createjs.Shape;

    constructor(yamlData: ResourceYamlData, queue: createjs.LoadQueue) {
        super();
        this.cardIcon = new createjs.Bitmap("");
        this.cardName = new createjs.Text(null);

        this.cardName.x = (global.cardIconSize * 1) + 2;
        this.cardName.y = (global.cardIconSize / 2) - 6;
        //this.cardName.textAlign = "center";
        this.cardName.font = "12px Arial"

        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-4, -4, (global.cardIconSize + (12 *8)) + 8, (global.cardIconSize) + 8);

        this.scaleX = 1.5;
        this.scaleY = 1.5;
        this.addChild(this.backGround);
        this.addChild(this.cardIcon);
        this.addChild(this.cardName);

        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight / 2;

    }
    setYamlData(yamlData: ResourceYamlData | null, queue: createjs.LoadQueue) {
        if (yamlData != null) {
            this.cardIcon.image = getIconResource(yamlData.index, "resource", queue);
            this.cardName.text = yamlData.name;
        }
    }
}
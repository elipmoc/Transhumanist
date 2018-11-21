import { global } from "../../boardGlobalData";
import { ResourceYamlData } from "../../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../../utility";
import { ImageQueue } from "../imageQueue";

export class ResourceHover extends createjs.Container {
    private cardIcon: createjs.Bitmap;
    private cardName: createjs.Text;
    private backGround: createjs.Shape;

    constructor() {
        super();
        this.cardIcon = new createjs.Bitmap("");
        this.cardName = new createjs.Text(null);

        this.cardName.x = (global.cardIconSize) + 2;
        this.cardName.y = (global.cardIconSize / 2) - 6;
        this.cardName.font = "16px Arial";

        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-4, -4, (global.cardIconSize + (12 * 8)) + 8, (global.cardIconSize) + 8);

        this.scaleX = 0.75;
        this.scaleY = 0.75;
        this.addChild(this.backGround);
        this.addChild(this.cardIcon);
        this.addChild(this.cardName);
    }
    setYamlData(yamlData: ResourceYamlData | null, queue: ImageQueue) {
        if (yamlData != null) {
            this.cardIcon.image = getIconResource(yamlData.index, "resource", queue);
            this.cardName.text = yamlData.name;
            this.x = this.stage.mouseX + global.cardIconSize / 2;
            this.y = this.stage.mouseY;
        }
    }
}
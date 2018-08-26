import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { MakeCard } from "./makeCard";
import * as global from "../boardGlobalData";
import { ResourceHash } from "../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../utility";

export class ActionCardHover extends createjs.Container {
    private cardInfo: MakeCard;
    private backGround: createjs.Shape;
    private resourceHash: ResourceHash;
    private costIcons: createjs.Bitmap[] = [new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null)];
    private costNums: createjs.Text[] = [new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null)];
    private useCostText: createjs.Text;

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(resourceHash: ResourceHash, queue: createjs.LoadQueue, size: number) {
        super();
        this.resourceHash = resourceHash;
        this.cardInfo = new MakeCard(size);
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-7, -7, (this.cardWidth) + (7 * 3) + (12 * 8), (this.cardHeight) + (7 * 2));

        this.addChild(this.backGround);
        this.addChild(this.cardInfo);

        this.useCostText = new createjs.Text(null);
        this.useCostText.text = "使用コスト";
        this.useCostText.font = "20px Arial";
        this.useCostText.x = (this.cardWidth) + 5;
        this.useCostText.y = 5;
        this.addChild(this.useCostText);

        this.costIcons.forEach((icon, i) => {
            icon.x = (this.cardWidth) + 7;
            icon.y = 7 + 24 + ((global.cardIconSize + 2) * i);
            this.addChild(icon);
        });
        this.costNums.forEach((num, i) => {
            num.x = (this.cardWidth) + (global.cardIconSize) + 7 + 3;
            num.y = 7 + 24 + ((global.cardIconSize + 2) * i);
            num.font = "22px Arial";
            this.addChild(num);
        });


        this.x = global.canvasWidth / 2 - this.cardWidth / 2;
        this.y = global.canvasHeight / 2 - this.cardHeight / 2;

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.cardInfo.setYamlData(yamlData, queue);

        for (let i = 0; i < global.costCountMax; i++) {
            if (yamlData != null && yamlData.cost.length > i) {
                this.costIcons[i].image = getIconResource(this.resourceHash[yamlData.cost[i].name].index, "resource", queue);
                this.costNums[i].text = yamlData.cost[i].number.toString();
            }
            else {
                this.costIcons[i].image = null;
                this.costNums[i].text = null;
            };
        }
    }
}
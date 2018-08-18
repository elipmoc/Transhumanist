import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { MakeCard } from "../../Client/boardView/makeCard";
import * as global from "../boardGlobalData";
import { ResourceHash } from "../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../utility";

export class ActionCardHover extends createjs.Container {
    private cardInfo: MakeCard;
    private backGround: createjs.Shape;
    private resourceHash: ResourceHash;
    private costIcon: createjs.Bitmap[] = [new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null)];

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(resourceHash: ResourceHash, queue: createjs.LoadQueue, size: number) {
        super();
        this.resourceHash = resourceHash;
        this.cardInfo = new MakeCard(size);
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-7, -7, (this.cardWidth) + 14, (this.cardHeight) + 14);

        this.addChild(this.backGround);
        this.addChild(this.cardInfo);
        for (let i = 0; i < global.costCountMax; i++) {
            if (this.costIcon[i].image != null) {
                this.costIcon[i].x = 0;
                this.costIcon[i].y = 40;
                this.addChild(this.costIcon[i]);
            }
            else break;
        }


        this.x = global.canvasWidth / 2 - this.cardWidth / 2;
        this.y = global.canvasHeight / 2 - this.cardHeight / 2;

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.cardInfo.setYamlData(yamlData, queue);
        
        for (let i = 0; i < global.costCountMax; i++){
            if (yamlData != null && yamlData.cost.length > i) {
                this.costIcon[i].image = getIconResource(this.resourceHash[yamlData.cost[i].name].index, "resource", queue);
            }
            else break;
        }
    }
}
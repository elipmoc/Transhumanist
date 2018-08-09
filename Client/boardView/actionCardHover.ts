import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { MakeCard } from "../../Client/boardView/makeCard";
import * as global from "../boardGlobalData";

export class ActionCardHover extends createjs.Container {
    private cardInfo: MakeCard;
    private backGround: createjs.Shape;

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(yamlData: ActionCardYamlData, queue: createjs.LoadQueue, size: number) {
        super();
        this.cardInfo = new MakeCard(size);
        this.cardInfo.setYamlData(yamlData, queue);

        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-7, -7, (this.cardWidth) + 14, (this.cardHeight) + 14);

        this.addChild(this.backGround);
        this.addChild(this.cardInfo);
        this.x = global.canvasWidth / 2 - this.cardWidth / 2;
        this.y = global.canvasHeight / 2 - this.cardHeight / 2;

    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.cardInfo.setYamlData(yamlData, queue);
    }
}
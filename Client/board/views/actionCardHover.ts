import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { DetailsActionCard } from "./detailsActionCard";
import { global } from "../../boardGlobalData";
import { ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { Cost } from "./actionCardHover/cost";
import { WarUse } from "./actionCardHover/warUse";
import { Condition } from "./actionCardHover/condition";

export class ActionCardHover extends createjs.Container {
    private cardInfo: DetailsActionCard;
    private backGround: createjs.Shape;
    private costView: Cost;
    private warUseView: WarUse;
    private conditionView: Condition;

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(resourceHash: ResourceHash, size: number) {
        super();
        this.costView = new Cost(resourceHash);
        this.warUseView = new WarUse();
        this.conditionView = new Condition();

        this.cardInfo = new DetailsActionCard(size);
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(0, 0, (this.cardWidth) + (7 * 2), (this.cardHeight) + (7 * 2));

        this.addChild(this.backGround);
        this.cardInfo.x = 7;
        this.cardInfo.y = 7;
        this.addChild(this.cardInfo);

        this.costView.x = (this.cardWidth) + (7 * 2) + 7;
        this.addChild(this.costView);

        this.warUseView.x = (this.cardWidth) + (7 * 2) + 7;
        this.warUseView.y = ((global.cardIconSize + 2) * 6) + (7 * 2) + 7
        this.addChild(this.warUseView);

        this.conditionView.y = (this.cardHeight) + (7 * 2) + 7;
        this.addChild(this.conditionView);

        this.x = (global.canvasWidth / 2 - this.cardWidth / 2);
        this.y = (global.canvasHeight / 2 - this.cardHeight / 2);
    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
        this.cardInfo.setYamlData(yamlData, queue);
        this.costView.setYamlData(yamlData, queue);
        this.warUseView.setYamlData(yamlData);
        this.conditionView.setYamlData(yamlData);
    }
}
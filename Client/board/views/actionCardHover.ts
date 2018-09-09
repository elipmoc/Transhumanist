import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { DetailsActionCard } from "./detailsActionCard";
import { global } from "../../boardGlobalData";
import { ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../../utility";

export class ActionCardHover extends createjs.Container {
    private cardInfo: DetailsActionCard;
    private backGround: createjs.Shape;
    //private resourceHash: ResourceHash;
    private costView: CostView;
    private warUseView: WarUseView;
    private conditionView: ConditionView;

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(resourceHash: ResourceHash, size: number) {
        super();
        this.costView = new CostView(resourceHash);
        this.warUseView = new WarUseView();
        this.conditionView = new ConditionView();

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

class CostView extends createjs.Container{
    private costIcons: createjs.Bitmap[] = [new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null)];
    private costNums: createjs.Text[] = [new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null)];
    private useCostText: createjs.Text;
    private resourceHash: ResourceHash;
    private backGround: createjs.Shape;

    constructor(resourceHash: ResourceHash) {
        super();
        this.resourceHash = resourceHash;
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#fce5cd").drawRect(0, 0, (108) + (7 * 2), ((global.cardIconSize + 2) * 6) + (7 * 2));

        this.addChild(this.backGround);

        this.useCostText = new createjs.Text(null);
        this.useCostText.text = "使用コスト";
        this.useCostText.color = "#111";
        this.useCostText.font = "20px Arial";
        this.useCostText.x = 5 + 7;
        this.useCostText.y = 5 + 7;
        this.addChild(this.useCostText);

        this.costIcons.forEach((icon, i) => {
            icon.x = 7 + 7;
            icon.y = 7 + 24 + ((global.cardIconSize + 2) * i) + 7;
            this.addChild(icon);
        });
        this.costNums.forEach((num, i) => {
            num.x = (global.cardIconSize) + 7 + 3 + 7;
            num.y = 7 + 24 + ((global.cardIconSize + 2) * i) + 7;
            num.font = "22px Arial";
            this.addChild(num);
        });
    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: createjs.LoadQueue) {
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

class WarUseView extends createjs.Container{
    private backGround: createjs.Shape;
    private warUseText: createjs.Text;

    constructor(){
        super();
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#cfe2f3").drawRect(0, 0, (108) + (7 * 2), (18*2) + (7 * 2));

        this.warUseText = new createjs.Text(null);
        this.warUseText.text = "戦争中にのみ\n使用可能";
        this.warUseText.color = "#00E";
        this.warUseText.font = "18px Arial";
        this.warUseText.x = 7;
        this.warUseText.y = 7;

        this.addChild(this.backGround);
        this.addChild(this.warUseText);
    }

    setYamlData(yamlData: ActionCardYamlData | null) { 
        if (yamlData != null) {
            this.visible = yamlData.war_use;
        }
    }
}

class ConditionView extends createjs.Container {
    private backGround: createjs.Shape;
    private descriptText: createjs.Text;
    private conditionText: createjs.Text;

    constructor() {
        super();
        this.backGround = new createjs.Shape();
        this.descriptText = new createjs.Text(null);
        this.conditionText = new createjs.Text(null);

        this.backGround.graphics.beginFill("#f4cccc").drawRect(0, 0, (253) + (108) + (7 * 4), (60) + (7 * 2));
        this.descriptText.text = "使用条件：";
        this.descriptText.color = "#E00";
        this.descriptText.font = "20px Arial";
        this.descriptText.x = 7;
        this.descriptText.y = 7;

        this.conditionText.color = "#600";
        this.conditionText.font = "18px Arial";
        this.conditionText.x = 7;
        this.conditionText.y = (7 * 2) + 20;

        this.addChild(this.backGround);
        this.addChild(this.descriptText);
        this.addChild(this.conditionText);
    }

    setYamlData(yamlData: ActionCardYamlData | null) {
        if (yamlData != null) {
            if (yamlData.conditionDescript != undefined) {
                this.conditionText.text = yamlData.conditionDescript;
                this.visible = true;
            } else {
                this.visible = false;
            }
        }
    }
}
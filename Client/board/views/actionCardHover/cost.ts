import { ResourceHash } from "../../../../Share/Yaml/resourceYamlData";
import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";
import { getIconResource } from "../../../utility";
import { global } from "../../../boardGlobalData";
import { ImageQueue } from "../../imageQueue";

export class Cost extends createjs.Container {
    private costIcons: createjs.Bitmap[] = [new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null), new createjs.Bitmap(null)];
    private costNums: createjs.Text[] = [new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null), new createjs.Text(null)];
    private useCostText: createjs.Text;
    private resourceHash: ResourceHash;
    private backGround: createjs.Shape;

    constructor(resourceHash: ResourceHash) {
        super();
        this.resourceHash = resourceHash;
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#fce5cd").drawRect(0, 0, (108) + (7 * 2), ((global.cardIconSize/2 + 2) * 6) + (7 * 2));

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
            icon.y = 7 + 24 + ((global.cardIconSize/2 + 2) * i) + 7;
            this.addChild(icon);
        });
        this.costNums.forEach((num, i) => {
            num.x = (global.cardIconSize/2) + 7 + 3 + 7;
            num.y = 11 + 24 + ((global.cardIconSize/2 + 2) * i) + 7;
            num.font = "22px Arial";
            this.addChild(num);
        });
    }
    setYamlData(yamlData: ActionCardYamlData | null, queue: ImageQueue) {
        for (let i = 0; i < global.costCountMax; i++) {
            if (yamlData != null && yamlData.cost.length > i) {
                this.costIcons[i].image = getIconResource(this.resourceHash[yamlData.cost[i].name].index, "resource", queue);
                this.costIcons[i].scaleX = 0.5;
                this.costIcons[i].scaleY = 0.5;
                this.costNums[i].text = yamlData.cost[i].number.toString();
            }
            else {
                console.log(this.costIcons +" "+ i);
                this.costIcons[i].image = null;
                this.costNums[i].text = null;
            };
        }
    }
}
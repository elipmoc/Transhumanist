import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";

export class Condition extends createjs.Container {
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
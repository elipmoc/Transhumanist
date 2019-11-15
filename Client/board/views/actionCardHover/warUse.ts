import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";

export class WarUse extends createjs.Container {
    private backGround: createjs.Shape;
    private warUseText: createjs.Text;

    constructor() {
        super();
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#cfe2f3").drawRect(0, 0, (108) + (7 * 2), (18 * 2) + (7 * 2));

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
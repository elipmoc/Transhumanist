import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";
import { ActionCardYamlData, CreateGet } from "../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../imageQueue";
import { SelectButton } from "./buildActionSelect/selectButton";
import { ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { PopupWindowBase } from "./bases/popupWindowBase";

export class BuildActionSelectWindow extends PopupWindowBase {
    private cardName = new createjs.Text();
    private callBack: () => void;
    private selectButton: SelectButton[] = [new SelectButton(), new SelectButton(), new SelectButton()];

    constructor() {
        super(700, 400);

        this.cardName.textAlign = "center";
        this.cardName.text = "";
        this.cardName.font = "20px Bold ＭＳ ゴシック";
        this.cardName.color = "white";
        this.cardName.shadow = createMyShadow();
        this.cardName.x = global.canvasWidth / 2;
        this.cardName.y = global.canvasHeight / 2 - 180;

        const description = new createjs.Text("効果を選択してください。");
        description.textAlign = "center";
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 130;
        description.font = "20px ＭＳゴシック";
        description.color = "white";
        description.shadow = createMyShadow();

        const button = new DecisionButton("やめる");
        button.x = global.canvasWidth / 2;
        button.y = global.canvasHeight / 2 + 120;
        button.addEventListener("click", () => this.callBack());

        this.addChild(description);
        this.addChild(this.cardName, button);

        for (let i = 0; this.selectButton.length > i; i++) {
            this.selectButton[i].x = global.canvasWidth / 2 - 260 + (200 * i);
            this.selectButton[i].y = global.canvasHeight / 2 - 70;
            this.addChild(this.selectButton[i]);
        }
    }

    private setName(text: string) {
        this.cardName.text = text;
    }

    closeOnClick(callBack: () => void) {
        this.callBack = callBack;
    }

    setYaml(yaml: ActionCardYamlData | null, queue: ImageQueue, resourceHash: ResourceHash) {
        this.setName(yaml.name);

        this.selectButton.forEach((button, index) => {
            button.setCommandData(<CreateGet>yaml.commands[index].body, queue, resourceHash);
        });
    }
    selectOnClick(callback: (num: number) => void) {
        this.selectButton.forEach((button, index) => {
            button.onClickCallback(() => { callback(index) });
        });
    }
}
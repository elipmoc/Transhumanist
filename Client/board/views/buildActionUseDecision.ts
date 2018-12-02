import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";

export class BuildActionUseDecision extends createjs.Container {
    private descriptionText = new createjs.Text();
    private callBack: () => void;

    constructor() {
        super();

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 440;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        this.descriptionText.textAlign = "center";
        this.descriptionText.text = "";
        this.descriptionText.font = "20px Bold ＭＳ ゴシック";
        this.descriptionText.color = "white";
        this.descriptionText.shadow = createMyShadow();
        this.descriptionText.x = global.canvasWidth / 2;
        this.descriptionText.y = global.canvasHeight / 2 - 200;

        const button = new DecisionButton("やめる");
        button.x = global.canvasWidth / 2;
        button.y = global.canvasHeight / 2 + 170;
        button.addEventListener("click", () => this.callBack());

        this.addChild(frame);
        this.addChild(this.descriptionText, button);
    }

    setText(text: string) {
        this.descriptionText.text = text;
    }

    buttonOnClick(callBack: () => void) {
        this.callBack = callBack;
    }
}
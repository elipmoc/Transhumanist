import * as global from "../boardGlobalData";
import { createMyShadow } from "../utility";


//獲得するアクションカードを選択するウインドウ
export class SelectActionWindow extends createjs.Container {
    constructor(queue: createjs.LoadQueue) {
        super();

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 290;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        const descriptionText = new createjs.Text();
        descriptionText.textAlign = "center";
        descriptionText.text = "ダイスを選択してください。";
        descriptionText.font = "16px Bold ＭＳ ゴシック";
        descriptionText.color = "white";
        descriptionText.shadow = createMyShadow();
        descriptionText.x = global.canvasWidth / 2;
        descriptionText.y = global.canvasHeight / 2 - 130;

        this.addChild(frame);
        this.addChild(descriptionText);

    }
}
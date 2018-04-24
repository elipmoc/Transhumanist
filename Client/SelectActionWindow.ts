import * as global from "./boardGlobalData"

//獲得するアクションカードを選択するウインドウ
export class SelectActionWindow extends createjs.Container {
    constructor(queue: createjs.LoadQueue) {
        super();
        const frame = new createjs.Shape();
        const frameX = 450;
        const frameY = 250;
        frame.graphics.beginFill("white").
            drawRect(0, 0, frameX, frameY);
        frame.alpha = 0.5;
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        const descriptionText = new createjs.Text();
        descriptionText.textAlign = "center";
        descriptionText.text = "獲得するアクションカードを選択してください。";
        descriptionText.font = "16px Bold ＭＳ ゴシック";
        descriptionText.color = "white";
        descriptionText.x = global.canvasWidth / 2;
        descriptionText.y = global.canvasHeight / 2 - 100;

        this.addChild(frame);
        this.addChild(descriptionText);
    }
}
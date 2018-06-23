import * as global from "../boardGlobalData";
import { createMyShadow } from "../utility";


class DiceIcon extends createjs.Container {

    static readonly size: number = 100;

    constructor(diseNum: number) {
        super();
        let dise = new createjs.Shape(new createjs.Graphics().beginFill("white").drawRoundRect(-DiceIcon.size / 2, -DiceIcon.size / 2, DiceIcon.size, DiceIcon.size, 5));
        this.addChild(dise);
        let text = new createjs.Text(diseNum.toString(), "64px Bold ＭＳ ゴシック");
        text.y = -45;
        text.textAlign = "center";
        this.addChild(text);
    }
}

//獲得するアクションカードを選択するウインドウ
export class SelectDiceWindow extends createjs.Container {
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

        const dise = new DiceIcon(3);
        dise.x = global.canvasWidth / 2;
        dise.y = global.canvasHeight / 2;
        const dise2 = new DiceIcon(2);;
        dise2.x = global.canvasWidth / 2 + DiceIcon.size + 10;
        dise2.y = global.canvasHeight / 2;
        const dise3 = new DiceIcon(1);
        dise3.x = global.canvasWidth / 2 - (DiceIcon.size + 10);
        dise3.y = global.canvasHeight / 2;
        this.addChild(frame);
        this.addChild(descriptionText);
        this.addChild(dise);
        this.addChild(dise2);
        this.addChild(dise3);

    }
}
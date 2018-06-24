import * as global from "../boardGlobalData";
import { createMyShadow } from "../utility";


//ダイスアイコン
export class DiceIcon extends createjs.Container {

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
    private diceList: DiceIcon[] = new Array();

    setDiceList(diceList: DiceIcon[]) {
        this.diceList.forEach(x => this.removeChild(x));
        this.diceList = diceList;
        const diceOdd = diceList.length % 2 != 0;
        const fixWidth = diceOdd ?
            Math.floor(diceList.length / 2) * (DiceIcon.size + 10) :
            ((diceList.length / 2) - 1) * (DiceIcon.size + 10) + DiceIcon.size / 2 + 5;
        diceList.forEach((dice, index) => {
            dice.x = global.canvasWidth / 2 - fixWidth + index * (DiceIcon.size + 10);
            dice.y = global.canvasHeight / 2;
            this.addChild(dice);
        });
    }

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
        this.setDiceList([new DiceIcon(3), new DiceIcon(2), new DiceIcon(1), new DiceIcon(5)]);
        this.setDiceList([new DiceIcon(3)]);
        // this.setDiceList([new DiceIcon(3), new DiceIcon(2)]);

    }
}
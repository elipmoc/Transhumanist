import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DiceData } from "../../Share/diceData";


//ダイスアイコン
export class DiceIcon extends createjs.Container {

    static readonly size: number = 100;

    constructor(diseNum: number) {
        super();
        let dise = new createjs.Shape(new createjs.Graphics().beginFill("white").drawRoundRect(-DiceIcon.size / 2, -DiceIcon.size / 2, DiceIcon.size, DiceIcon.size, 5));
        this.addChild(dise);
        let text = new createjs.Text(diseNum.toString(), "64px Bold ＭＳ ゴシック");
        text.y = -32;
        text.textAlign = "center";
        this.addChild(text);
        dise.addEventListener("click", () => this.callBack());

        dise.alpha = 0.7;
        dise.addEventListener("mouseover", () => { dise.alpha = 1.0; this.stage.update(); });
        dise.addEventListener("mouseout", () => { dise.alpha = 0.7; this.stage.update(); });
    }

    private callBack: () => void;

    onClicked(callBack: () => void) {
        this.callBack = callBack;
    }
}

//獲得するアクションカードを選択するウインドウ
export class SelectDiceWindow extends createjs.Container {
    private diceIconList: DiceIcon[] = new Array();
    private callBack: (index: number) => void;
    private causeText = new createjs.Text("");

    setDiceList(diceList: number[]) {
        this.diceIconList.forEach(x => this.removeChild(x));
        this.diceIconList = diceList.map(x => new DiceIcon(x));
        const diceOdd = diceList.length % 2 != 0;
        const fixWidth = diceOdd ?
            Math.floor(diceList.length / 2) * (DiceIcon.size + 10) :
            ((diceList.length / 2) - 1) * (DiceIcon.size + 10) + DiceIcon.size / 2 + 5;
        this.diceIconList.forEach((dice, index) => {
            dice.x = global.canvasWidth / 2 - fixWidth + index * (DiceIcon.size + 10);
            dice.y = global.canvasHeight / 2 + 16;
            dice.onClicked(() => this.callBack(index));
            this.addChild(dice);
        });
    }

    onSelectedDise(callBack: (index: number) => void) {
        this.callBack = callBack;
    }

    constructor() {
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

        this.causeText.textAlign = "center";
        this.causeText.font = "24px Bold ＭＳ ゴシック";
        this.causeText.color = "white";
        this.causeText.shadow = createMyShadow();
        this.causeText.x = global.canvasWidth / 2;
        this.causeText.y = global.canvasHeight / 2 - 100;

        this.y = -180;

        this.addChild(frame);
        this.addChild(descriptionText,this.causeText);
    }

    setText(text:string) {
        this.causeText.text = text;
    }
}
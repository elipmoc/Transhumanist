import { global } from "../../boardGlobalData"
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { createMyShadow } from "../../utility";
import { ImageQueue } from "../imageQueue";
import { PopupWindowBase } from "./bases/popupWindowBase";

class NumberOfActionCardTexts extends createjs.Container {
    private texts: createjs.Text[] = new Array();

    constructor() {
        super();
        const maxLevel = 6;
        const widthInterval = 105;
        for (let i = 0; i < maxLevel; i++) {
            const text = new createjs.Text();
            text.color = "white";
            text.font = "16px Bold ＭＳ ゴシック";
            text.textAlign = "center";
            text.text = "99/99\n(99)";
            text.x = widthInterval * i;
            this.addChild(text);
            this.texts.push(text);
        }
    }

    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        for (let i = 0; i < numberOfActionCardList.length; i++) {
            this.texts[i].text =
                numberOfActionCardList[i].currentNumber +
                "/" +
                numberOfActionCardList[i].maxNumber +
                "\n(" +
                numberOfActionCardList[i].dustNumber + ")";
        }
    }
}

//獲得するアクションカードを選択するウインドウ
export class SelectActionWindow extends PopupWindowBase {

    private callBack: (value: number) => void;
    private numberOfActionCardTexts: NumberOfActionCardTexts;

    constructor(queue: ImageQueue) {
        super(700, 290);

        this.numberOfActionCardTexts = new NumberOfActionCardTexts();
        this.numberOfActionCardTexts.x = global.canvasWidth / 2 - this.getWidth() / 2 + 90;
        this.numberOfActionCardTexts.y = global.canvasHeight / 2 + this.getHeight() / 2 - 50;

        const descriptionText = new createjs.Text();
        descriptionText.textAlign = "center";
        descriptionText.text = "獲得するアクションカードを選択してください。";
        descriptionText.font = "16px Bold ＭＳ ゴシック";
        descriptionText.color = "white";
        descriptionText.shadow = createMyShadow();
        descriptionText.x = global.canvasWidth / 2;
        descriptionText.y = global.canvasHeight / 2 - 130;

        this.addChild(descriptionText);
        this.addChild(this.numberOfActionCardTexts);

        for (var i = 1; i <= 3; i++) {
            const level = queue.getImage("level" + (4 - i) + "mb");
            level.y = global.canvasHeight / 2 - 60;
            level.x = global.canvasWidth / 2 - (level.image.width + 20) * (i) + 10;
            const levelValue = 4 - i;
            level.addEventListener("click", () => this.callBack(levelValue));
            this.addChild(level);
        }

        for (var i = 4; i <= 6; i++) {
            const level = queue.getImage("level" + i + "mb");
            level.y = global.canvasHeight / 2 - 60;
            level.x = global.canvasWidth / 2 + (level.image.width + 20) * (i - 4) + 10;
            const levelValue = i;
            level.addEventListener("click", () => this.callBack(levelValue));
            this.addChild(level);
        }
    }
    onSelectedLevel(callBack: (value: number) => void) {
        this.callBack = callBack;
    }
    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        this.numberOfActionCardTexts.setNumberOfActionCard(numberOfActionCardList);
    }
}
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
    private level = new Array<createjs.Bitmap>(6);
    //リソースによる引けるカードレベルの制限があるかどうか
    private isDrawCardLevelLimit = false;

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

        for (let i = 0; this.level.length > i; i++) {
            this.level[i] = queue.getImage("level" + (i + 1) + "mb");
        }

        this.level.forEach((level, index) => {
            level.y = global.canvasHeight / 2 - 60;
            level.alpha = 0.7;

            //魔法の呪文（大嘘）
            level.x = (global.canvasWidth / 2 - (level.image.width + 20) * (3) + 10)
                + (level.image.width + 20) * (index);

            level.addEventListener("click", () => this.callBack(index + 1));
            level.addEventListener("mouseover", () => { level.alpha = 1.0; this.stage.update(); });
            level.addEventListener("mouseout", () => { level.alpha = 0.7; this.stage.update(); });
            this.addChild(level);
        });
    }
    //ドローカードレベルの制限フラグセット
    setDrawCardLevelLimit(isLimit: boolean) {
        this.isDrawCardLevelLimit = isLimit;
        this.level[4 - 1].visible = !isLimit;
        this.level[5 - 1].visible = !isLimit;
    }
    onSelectedLevel(callBack: (value: number) => void) {
        this.callBack = callBack;
    }
    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        this.numberOfActionCardTexts.setNumberOfActionCard(numberOfActionCardList);
        this.level.forEach((level, index) => {
            level.visible =
                (0 != numberOfActionCardList[index].currentNumber + numberOfActionCardList[index].dustNumber)
                && ((this.isDrawCardLevelLimit && (index == 4 - 1 || index == 5 - 1)) == false);
        });
        this.stage.update();
    }
}
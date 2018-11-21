import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ActionCardHash } from "../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../imageQueue";
import { SelectWinCard }from "./bases/selectWinCard";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { DecisionButton } from "./decisionButton";

export class SelectWinCardWindow extends createjs.Container {
    private descriptionText = new createjs.Text();
    private winCards: SelectWinCard[] = [new SelectWinCard(2), new SelectWinCard(2), new SelectWinCard(2)]; 
    private callBack: () => void;

    constructor(actionCardHash: ActionCardHash, imgQueue:ImageQueue) {
        super();

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 440;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        this.winCards[0].setYamlData(actionCardHash["火星の支配"], imgQueue);
        this.winCards[0].x = global.canvasWidth / 2 - (43 * 7);

        this.winCards[1].setYamlData(actionCardHash["A.Iによる支配"], imgQueue);
        this.winCards[1].x = global.canvasWidth / 2 - 86;

        this.winCards[2].setYamlData(actionCardHash["宗教による支配"], imgQueue);
        this.winCards[2].x = global.canvasWidth / 2 + (43 * 3);

        for (var i = 0; this.winCards.length > i; i++){
            this.winCards[i].y = global.canvasHeight / 2 - frameY / 4 -40;
        }

        this.descriptionText.textAlign = "center";
        this.descriptionText.text = "欲しいレベル6カードを選択してください。";
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
        for (var i = 0; this.winCards.length > i; i++) {
            this.addChild(this.winCards[i]);
        }
        this.addChild(this.descriptionText,button);
    }

    setCardNumber(cardNum: NumberOfActionCard[]) {
        for (var i = 0; this.winCards.length > i; i++){
            this.winCards[i].setCardNumber(cardNum[i]);
        }
    }

    cardOnClick(callBack: (value:number) => void) {
        for (var i = 0; this.winCards.length > i; i++){
            this.winCards[i].setIndex(i);
            this.winCards[i].onClick(callBack);
        }
    }

    buttonOnClick(callBack: () => void) {
        this.callBack = callBack;
    }
}
import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ActionCardHash } from "../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../imageQueue";
import { SelectWinCard } from "./bases/selectWinCard";
import { WinActionCardData } from "../../../Share/winActionCardData";
import { DecisionButton } from "./decisionButton";
import { PopupWindowBase } from "./bases/popupWindowBase";

export class SelectWinCardWindow extends PopupWindowBase {
    private descriptionText = new createjs.Text();
    private winCards: { [cardName: string]: SelectWinCard } = {};
    private callBack: () => void;

    constructor(actionCardHash: ActionCardHash, imgQueue: ImageQueue) {
        super(700, 440);

        this.winCards["火星の支配"] = new SelectWinCard(2);
        this.winCards["火星の支配"].setYamlData(actionCardHash["火星の支配"], imgQueue);
        this.winCards["火星の支配"].x = global.canvasWidth / 2 - (43 * 7);

        this.winCards["A.Iによる支配"] = new SelectWinCard(2);
        this.winCards["A.Iによる支配"].setYamlData(actionCardHash["A.Iによる支配"], imgQueue);
        this.winCards["A.Iによる支配"].x = global.canvasWidth / 2 - 86;

        this.winCards["宗教による支配"] = new SelectWinCard(2);
        this.winCards["宗教による支配"].setYamlData(actionCardHash["宗教による支配"], imgQueue);
        this.winCards["宗教による支配"].x = global.canvasWidth / 2 + (43 * 3);


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

        Object.values(this.winCards).forEach(x => {
            x.y = global.canvasHeight / 2 - this.getHeight() / 4 - 40;
            this.addChild(x);
        });

        this.addChild(this.descriptionText, button);
    }

    setCardNumber(cardData: WinActionCardData) {
        if (this.winCards[cardData.cardName])
            this.winCards[cardData.cardName].setCardNumber(cardData);
    }

    //カードが選択されたときに呼ばれるイベント
    onClickCard(callBack: (cardName: string) => void) {
        Object.keys(this.winCards).forEach(key =>
            this.winCards[key].onClick(() => callBack(key))
        );
    }
    //カードがホバーされたときに呼ばれるイベント
    onMouseOveredCard(callBack: (cardName: string) => void) {
        Object.keys(this.winCards).forEach(key =>
            this.winCards[key].onMouseOvered(() => callBack(key))
        );
    }
    //カードのホバーが解除されたときに呼ばれるイベント
    onMouseOutedCard(callBack: (cardName: string) => void) {
        Object.keys(this.winCards).forEach(key =>
            this.winCards[key].onMouseOuted(() => callBack(key))
        );
    }

    buttonOnClick(callBack: () => void) {
        this.callBack = callBack;
    }
}
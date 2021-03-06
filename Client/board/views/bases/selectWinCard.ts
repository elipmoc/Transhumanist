import { ImageQueue } from "../../imageQueue";
import { DetailsActionCard } from "../detailsActionCard";
import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";
import { WinActionCardData } from "../../../../Share/winActionCardData";

export class SelectWinCard extends createjs.Container {
    private winCard: DetailsActionCard;

    //透過表示用
    private nothingWinCard: DetailsActionCard;

    private cardNumber = new createjs.Text();
    private clickCallBack: () => void;
    onClick(callBack: () => void) {
        this.clickCallBack = callBack;
    }
    private mouseOveredCallBack: () => void;
    onMouseOvered(callBack: () => void) {
        this.mouseOveredCallBack = callBack;
    }
    private mouseOutedCallBack: () => void;
    onMouseOuted(callBack: () => void) {
        this.mouseOutedCallBack = callBack;
    }


    constructor(size: number) {
        super();
        this.winCard = new DetailsActionCard(size);
        this.winCard.addEventListener("click", () => this.clickCallBack());
        this.winCard.addEventListener("mouseover", () => this.mouseOveredCallBack());
        this.winCard.addEventListener("mouseout", () => this.mouseOutedCallBack());

        this.nothingWinCard = new DetailsActionCard(size);
        this.nothingWinCard.alpha = 0.2;
        this.nothingWinCard.visible = false;

        this.cardNumber.textAlign = "center";
        this.cardNumber.color = "white";
        this.cardNumber.font = "16px Bold ＭＳ ゴシック";
        this.cardNumber.x = 86;
        this.cardNumber.y = 260;
        this.addChild(this.winCard, this.nothingWinCard, this.cardNumber);
    }

    setYamlData(yamlData: ActionCardYamlData | null, queue: ImageQueue) {
        this.winCard.setYamlData(yamlData, queue);
        this.nothingWinCard.setYamlData(yamlData, queue);
    }
    setCardNumber(cardNum: WinActionCardData) {
        this.cardNumber.text =
            cardNum.currentNumber +
            "/" +
            cardNum.maxNumber;
        if (cardNum.currentNumber == 0) {
            this.winCard.visible = false;
            this.nothingWinCard.visible = true;
        }
        else {
            this.winCard.visible = true;
            this.nothingWinCard.visible = false;
        }
    }
}

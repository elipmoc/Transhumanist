import { NumberOfActionCard } from "../../../../Share/numberOfActionCard";
import { ImageQueue } from "../../imageQueue";
import { DetailsActionCard } from "../detailsActionCard";
import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";

export class SelectWinCard extends createjs.Container {
    private winCard: DetailsActionCard;

    //透過表示用
    private nothingWinCard: DetailsActionCard;

    private cardNumber = new createjs.Text();
    private callBack: (value:number) => void;
    private index: number;
    
    constructor(size: number) {
       super();
        this.winCard = new DetailsActionCard(size);
        this.winCard.addEventListener("click", () => this.callBack(this.index));

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
    setCardNumber(cardNum: NumberOfActionCard) {
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
    setIndex(index: number) {
        this.index = index;
    }

    onClick(callBack: (value:number) => void) {
        this.callBack = callBack;
    }
}

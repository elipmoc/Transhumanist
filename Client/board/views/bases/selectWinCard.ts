import { NumberOfActionCard } from "../../../../Share/numberOfActionCard";
import { ImageQueue } from "../../imageQueue";
import { DetailsActionCard } from "../detailsActionCard";
import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";

export class SelectWinCard extends createjs.Container {
    private winCard: DetailsActionCard;
    private cardNumber = new createjs.Text();
    private callBack: (value:number) => void;
    private index: number;
    
    constructor(size: number) {
       super();
        this.winCard = new DetailsActionCard(size);
        this.winCard.addEventListener("click", () => this.callBack(this.index));

        this.cardNumber.textAlign = "center";
        this.cardNumber.color = "white";
        this.cardNumber.font = "16px Bold ＭＳ ゴシック";
        this.cardNumber.x = 86;
        this.cardNumber.y = 260;
        this.addChild(this.winCard, this.cardNumber);
    }

    setYamlData(yamlData: ActionCardYamlData | null, queue: ImageQueue) {
        this.winCard.setYamlData(yamlData, queue);
    }
    setCardNumber(cardNum:NumberOfActionCard) {
        this.cardNumber.text =
            cardNum.currentNumber +
            "/" +
            cardNum.maxNumber;
    }
    setIndex(index: number) {
        this.index = index;
    }

    onClick(callBack: (value:number) => void) {
        this.callBack = callBack;
    }
}

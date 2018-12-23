import { ActionCardStack } from "./actionCardStack";
import { ActionCardYamlData, ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";

//山札と捨て札を一つのペアとして持つクラス
export class ActionCardStackPair {
    //山札
    private actionCardStack: ActionCardStack = new ActionCardStack();
    //捨て札
    private actionCardDiscardStack: ActionCardStack = new ActionCardStack();

    private maxStack: number;

    getNumberOfActionCard() {
        let data: NumberOfActionCard = {
            currentNumber: this.actionCardStack.length,
            maxNumber: this.maxStack,
            dustNumber: this.actionCardDiscardStack.length
        };
        return data;
    }

    registMaxStack() {
        this.maxStack = this.actionCardStack.length;
    }

    addCard(actionCardYamlData: ActionCardYamlData) {
        for (let i = 0; i < actionCardYamlData.number; i++)
            this.actionCardStack.add(actionCardYamlData);
    }

    shuffle() {
        this.actionCardStack.shuffle();
    }

    draw() {
        let card = this.actionCardStack.draw();
        if (card == undefined)
            card = this.actionCardStack
                .swap(this.actionCardDiscardStack)
                .shuffle()
                .draw();
        return card;
    }

    drawByCardName(name: ActionCardName) {
        let card = this.actionCardStack.drawByCardName(name);
        if (card == undefined) {
            card = this.actionCardStack
                .swap(this.actionCardDiscardStack)
                .shuffle()
                .drawByCardName(name)
        }
        return card;
    }

    throwAway(card: ActionCardYamlData) {
        this.actionCardDiscardStack.add(card);
    }

}
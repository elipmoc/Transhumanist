import { ActionCardHash, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";
import { ActionCardStackPair } from "./actionCardStackPair";
import { SocketBinder } from "../socketBinder";
import { NumberOfActionCard } from "../../Share/numberOfActionCard";

//アクションカードの山札をレベルごとに持つクラス
export class ActionCardStacks {
    static maxLevel = 5;
    private actionCardStackPairList: ActionCardStackPair[] = [];
    private numberOfActionCardList: SocketBinder<NumberOfActionCard[]>;

    constructor(numberOfActionCardList: SocketBinder<NumberOfActionCard[]>) {
        this.numberOfActionCardList = numberOfActionCardList;
        const actionCardHash: ActionCardHash = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), false);
        for (let i = 0; i < ActionCardStacks.maxLevel; i++)
            this.actionCardStackPairList.push(new ActionCardStackPair());
        for (let actionCardYamlData of Object.values(actionCardHash))
            if (actionCardYamlData!.level <= ActionCardStacks.maxLevel)
                this.addCard(actionCardYamlData!);
        this.actionCardStackPairList.forEach(x => {
            x.registMaxStack();
            x.shuffle();
        });
        this.updateNumberOfActionCards();
    }

    private addCard(actionCardYamlData: ActionCardYamlData) {
        if (actionCardYamlData.level > ActionCardStacks.maxLevel) return;
        this.actionCardStackPairList[actionCardYamlData.level - 1].addCard(actionCardYamlData);
    }

    draw(level: number) {
        if (level > ActionCardStacks.maxLevel)
            throw "levelが不正です";
        const card = this.actionCardStackPairList[level - 1].draw();
        this.updateNumberOfActionCards();
        return card;
    }

    throwAway(card: ActionCardYamlData) {
        if (card.level > ActionCardStacks.maxLevel)
            throw "levelが不正です";
        this.actionCardStackPairList[card.level - 1].throwAway(card);
        this.updateNumberOfActionCards();
    }

    updateAt(socket: SocketIO.Socket) {
        this.numberOfActionCardList.updateAt(socket);
    }

    private updateNumberOfActionCards() {
        let numberOfActionCards = this.actionCardStackPairList.map(x => x.getNumberOfActionCard());
        numberOfActionCards.push({ currentNumber: 0, dustNumber: 0, maxNumber: 0 });
        this.numberOfActionCardList.Value = numberOfActionCards;
    }
}
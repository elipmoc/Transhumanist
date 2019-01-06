import { ActionCardHash, ActionCardYamlData, ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../../yamlGet";
import { ActionCardStackPair } from "./actionCardStackPair";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { SocketBinder } from "../../socketBinder";
import { WinActionCardStacks } from "./winActionCardStacks";

//アクションカードの山札をレベルごとに持つクラス
export class ActionCardStacks {
    static maxLevel = 5;
    private winActionCardStacks: WinActionCardStacks;
    private actionCardStackPairList: ActionCardStackPair[] = [];
    private numberOfActionCardList: SocketBinder.Binder<NumberOfActionCard[]>;

    constructor(boardSocketManager: SocketBinder.Namespace) {
        this.numberOfActionCardList = new SocketBinder.Binder<NumberOfActionCard[]>("numberOfActionCard");
        this.winActionCardStacks = new WinActionCardStacks(boardSocketManager);
        boardSocketManager.addSocketBinder(this.numberOfActionCardList);
        this.settingCard();
    }

    //山札をセットする
    settingCard() {
        this.winActionCardStacks.settingCard();
        this.actionCardStackPairList = [];
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
        if (card == undefined) return card;
        this.updateNumberOfActionCards();
        return card;
    }
    drawByCardName(name: ActionCardName, level: number) {
        if (level > ActionCardStacks.maxLevel)
            throw "levelが不正です";
        const card = this.actionCardStackPairList[level - 1].drawByCardName(name);
        if (card == undefined) return card;
        this.updateNumberOfActionCards();
        return card;
    }

    drawWinCard(cardName: ActionCardName) {
        const card = this.winActionCardStacks.draw(cardName);
        this.updateNumberOfActionCards();
        return card;
    }

    throwAway(card: ActionCardYamlData) {
        if (card.level > ActionCardStacks.maxLevel)
            return;
        this.actionCardStackPairList[card.level - 1].throwAway(card);
        this.updateNumberOfActionCards();
    }

    private updateNumberOfActionCards() {
        let numberOfActionCards = this.actionCardStackPairList.map(x => x.getNumberOfActionCard());
        numberOfActionCards.push(this.winActionCardStacks.getNumberOfActionCard());
        this.numberOfActionCardList.Value = numberOfActionCards;
    }
}
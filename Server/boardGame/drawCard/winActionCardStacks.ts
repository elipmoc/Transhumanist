import { SocketBinder } from "../../socketBinder";
import { WinActionCardStack } from "./winActionCardStack";
import { ActionCardHash, ActionCardName } from "../../../Client/Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../../Client/Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../../yamlGet";
import { WinActionCardData } from "../../../Client/Share/winActionCardData";

export class WinActionCardStacks {
    private winActionCardDataList = new SocketBinder.BinderList<WinActionCardData>("winActionCardDataList");
    private winActionCardStackList: { [cardName: string]: WinActionCardStack };

    constructor(boardSocketManager: SocketBinder.Namespace) {
        boardSocketManager.addSocketBinder(this.winActionCardDataList);
        this.settingCard();
    }

    //山札をセットする
    settingCard() {
        this.winActionCardStackList = {};
        const actionCardHash: ActionCardHash =
            GenerateActionCardYamlData(yamlGet("./Client/Resource/Yaml/actionCard.yaml"), false);
        Object.values(actionCardHash)
            .filter(x => x != undefined && x.level == 6)
            .forEach(x =>
                this.winActionCardStackList[x!.name] = new WinActionCardStack(x!)
            );
        this.winActionCardDataList.Value =
            Object.values(this.winActionCardStackList)
                .map(x => x.getWinActionCardData());

    }

    draw(name: ActionCardName) {
        const idx = this.winActionCardDataList.Value.findIndex(x => x.cardName == name);
        const card = this.winActionCardStackList[name].draw();
        this.winActionCardDataList.setAt(idx, this.winActionCardStackList[name].getWinActionCardData());
        return card;
    }

    getNumberOfActionCard() {
        const result = {
            currentNumber: 0,
            maxNumber: 0,
            dustNumber: 0
        };

        return this.winActionCardDataList.Value.reduce((acc, x) => {
            acc.currentNumber += x.currentNumber;
            acc.maxNumber += x.maxNumber;
            return acc;
        }, result);
    }
}
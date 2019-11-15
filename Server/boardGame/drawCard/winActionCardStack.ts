import { ActionCardYamlData } from "../../../Client/src/Share/Yaml/actionCardYamlData";
import { WinActionCardData } from "../../../Client/src/Share/winActionCardData";

//一種類の勝利カードの枚数を管理するクラス
export class WinActionCardStack {
    private actionCardYamlData: ActionCardYamlData;
    private winActionCardData: WinActionCardData;

    constructor(actionCardYamlData: ActionCardYamlData) {
        this.actionCardYamlData = actionCardYamlData;
        this.winActionCardData =
            {
                currentNumber: actionCardYamlData.number,
                maxNumber: actionCardYamlData.number,
                cardName: actionCardYamlData.name
            };

    }

    getWinActionCardData() {
        return this.winActionCardData;
    }

    draw() {
        if (this.winActionCardData.currentNumber <= 0)
            return undefined;
        this.winActionCardData.currentNumber--;
        return this.actionCardYamlData;
    }
}
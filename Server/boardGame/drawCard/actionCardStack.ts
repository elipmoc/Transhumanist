import { ActionCardYamlData, ActionCardName } from "../../../Client/Share/Yaml/actionCardYamlData";
import { arrayshuffle } from "../../../Client/Share/utility";

export class ActionCardStack {
    private actionCardYamlDataList: ActionCardYamlData[] = [];

    add(actionCardYamlData: ActionCardYamlData) {
        this.actionCardYamlDataList.push(actionCardYamlData);
    }

    draw() {
        return this.actionCardYamlDataList.pop();
    }

    drawByCardName(name: ActionCardName) {
        let card: ActionCardYamlData | undefined;
        this.actionCardYamlDataList =
            this.actionCardYamlDataList.filter(x => {
                if (card == undefined && x.name == name) {
                    card = x;
                    return false;
                }
                return true;
            });
        return card;
    }

    shuffle() {
        arrayshuffle(this.actionCardYamlDataList);
        return this;
    }

    swap(x: ActionCardStack) {
        const tmp = x.actionCardYamlDataList;
        x.actionCardYamlDataList = this.actionCardYamlDataList;
        this.actionCardYamlDataList = tmp;
        return this;
    }

    get length() { return this.actionCardYamlDataList.length; }

}
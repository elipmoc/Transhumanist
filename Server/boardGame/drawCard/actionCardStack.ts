import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { arrayshuffle } from "../../../Share/utility";

export class ActionCardStack {
    private actionCardYamlDataList: ActionCardYamlData[] = [];

    add(actionCardYamlData: ActionCardYamlData) {
        this.actionCardYamlDataList.push(actionCardYamlData);
    }

    draw() {
        return this.actionCardYamlDataList.pop();
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
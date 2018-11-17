import { SocketBinder } from "../socketBinder";
import { ActionCardName } from "../../Share/Yaml/actionCardYamlData";

export class BuildActionList {
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;

    constructor(boardSocketManager: SocketBinder.Namespace, playerId: number) {
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        boardSocketManager.addSocketBinder(this.buildActionList);
        this.clear();
    }
    clear() {
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
    }
    addBuildAction(name: ActionCardName) {
        const idx = this.buildActionList.Value.findIndex(x => x == null);
        if (idx != -1)
            this.buildActionList.setAt(idx, name);
    }
}
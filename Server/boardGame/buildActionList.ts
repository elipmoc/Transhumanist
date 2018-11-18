import { SocketBinder } from "../socketBinder";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

export class BuildActionList {
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;
    private useBuildActionCardCallback: (card: ActionCardYamlData) => void;

    constructor(boardSocketManager: SocketBinder.Namespace, playerId: number) {
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        const selectBuildAction =
            new SocketBinder.EmitReceiveBinder<SelectBuildActionData>("SelectBuildAction", true, [`player${playerId}`]);
        selectBuildAction.OnReceive(x => {
            const cardName = this.buildActionList.Value[x.iconId];

            const useBuildActionCard =
                GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), true)[cardName!];
            if (useBuildActionCard) {
                this.useBuildActionCardCallback(useBuildActionCard)
            }
        })
        boardSocketManager.addSocketBinder(this.buildActionList, selectBuildAction);
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
    //カードが使用されるときに呼ばれる関数をセット
    onUseBuildActionCard(f: (card: ActionCardYamlData) => void) {
        this.useBuildActionCardCallback = f;
    }
}
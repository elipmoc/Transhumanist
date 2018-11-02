import { SocketBinder } from "../socketBinder";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

export class PlayerActionCard {
    private actionCardList: SocketBinder.BinderList<string | null>;
    private actionCardDrawPhase: SocketBinder.Binder<boolean>;
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;

    constructor(playerId: number, actionCardStacks: ActionCardStacks, boardSocketManager: SocketBinder.Namespace) {
        //生成
        this.actionCardDrawPhase = new SocketBinder.Binder<boolean>("actionCardDrawPhase", true, [`player${playerId}`]);
        const selectActionCardLevel = new SocketBinder.EmitReceiveBinder<number>("selectActionCardLevel", true, [`player${playerId}`]);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList", true, [`player${playerId}`]);
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        const useActionCardIndex = new SocketBinder.EmitReceiveBinder<number>("useActionCardIndex", true, [`player${playerId}`]);

        //実装
        selectActionCardLevel.OnReceive(x => {
            if (this.actionCardDrawPhase.Value) {
                const idx = this.actionCardList.Value.findIndex(x => x == null);
                this.actionCardList.setAt(idx, actionCardStacks.draw(x).name);
                this.actionCardDrawPhase.Value = false;
            }
        });
        useActionCardIndex.OnReceive(actionCardIndex => {
            const useActionCardName = this.actionCardList.Value[actionCardIndex];
            if (useActionCardName) {
                const useActionCard = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), true)[useActionCardName];
                if (useActionCard) {
                    const idx = this.buildActionList.Value.findIndex(x => x == null);
                    if (idx != -1)
                        this.buildActionList.setAt(idx, useActionCardName);
                }
            }
            this.actionCardList.setAt(actionCardIndex, null);
        });

        //初期化
        this.actionCardDrawPhase.Value = false;
        this.actionCardList.Value = [null, null, null, null, null];
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);

        //socketBinder登録
        boardSocketManager.addSocketBinder(
            this.buildActionList,
            this.actionCardList,
            useActionCardIndex,
            this.actionCardDrawPhase, selectActionCardLevel);
    }

    //手札がいっぱいかどうか
    is_full() {
        return this.actionCardList.Value.find(x => x == null) === undefined;
    }

    set_drawPhase() {
        if (this.is_full() == false) {
            this.actionCardDrawPhase.Value = true;
        }
    }

    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }

    clear() {
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
        this.actionCardList.Value = [null, null, null, null, null];
        this.actionCardDrawPhase.Value = false;
    }
}
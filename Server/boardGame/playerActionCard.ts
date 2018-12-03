import { SocketBinder } from "../socketBinder";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

//カードを破棄するかのフラグ
type DestructionFlag = boolean;

export class PlayerActionCard {
    private actionCardList: SocketBinder.BinderList<string | null>;
    private actionCardDrawPhase: SocketBinder.Binder<boolean>;
    private useActionCardCallback: (card: ActionCardYamlData) => DestructionFlag;

    constructor(playerId: number, actionCardStacks: ActionCardStacks, boardSocketManager: SocketBinder.Namespace) {
        //生成
        this.actionCardDrawPhase = new SocketBinder.Binder<boolean>("actionCardDrawPhase", true, [`player${playerId}`]);
        const selectActionCardLevel = new SocketBinder.EmitReceiveBinder<number>("selectActionCardLevel", true, [`player${playerId}`]);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList", true, [`player${playerId}`]);
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
                const useActionCard = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), false)[useActionCardName];
                if (useActionCard && this.useActionCardCallback(useActionCard))
                    this.actionCardList.setAt(actionCardIndex, null);

            }
        });

        //初期化
        this.actionCardDrawPhase.Value = false;
        this.actionCardList.Value = [null, null, null, null, null];


        //socketBinder登録
        boardSocketManager.addSocketBinder(
            this.actionCardList,
            useActionCardIndex,
            this.actionCardDrawPhase, selectActionCardLevel);
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseActionCard(f: (card: ActionCardYamlData) => DestructionFlag) {
        this.useActionCardCallback = f;
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
        this.actionCardList.Value = [null, null, null, null, null];
        this.actionCardDrawPhase.Value = false;
    }
}
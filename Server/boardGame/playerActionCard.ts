import { SocketBinder } from "../socketBinder";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

//カードを破棄するかのフラグ
type DestructionFlag = boolean;

export class PlayerActionCard {
    private actionCardList: SocketBinder.BinderList<string | null>;
    private useActionCardCallback: (card: ActionCardYamlData) => DestructionFlag;
    private selectActionCardLevelCallback: (level: number) => void;
    private selectWinActionCardCallback: (cardName: string) => void;

    constructor(playerId: number, boardSocketManager: SocketBinder.Namespace) {
        //生成
        const selectActionCardLevel = new SocketBinder.EmitReceiveBinder<number>("selectActionCardLevel", true, [`player${playerId}`]);
        const selectWinActionCard = new SocketBinder.EmitReceiveBinder<string>("selectWinCard", true, [`player${playerId}`]);
        this.actionCardList = new SocketBinder.BinderList<string | null>("actionCardList", true, [`player${playerId}`]);
        const useActionCardIndex = new SocketBinder.EmitReceiveBinder<number>("useActionCardIndex", true, [`player${playerId}`]);

        //実装
        selectActionCardLevel.OnReceive(level =>
            this.selectActionCardLevelCallback(level)
        );
        selectWinActionCard.OnReceive(cardName =>
            this.selectWinActionCardCallback(cardName)
        );
        useActionCardIndex.OnReceive(actionCardIndex => {
            const useActionCardName = this.actionCardList.Value[actionCardIndex];
            if (useActionCardName) {
                const useActionCard = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), false)[useActionCardName];
                if (useActionCard && this.useActionCardCallback(useActionCard))
                    this.actionCardList.setAt(actionCardIndex, null);

            }
        });

        //初期化
        this.actionCardList.Value = [null, null, null, null, null];


        //socketBinder登録
        boardSocketManager.addSocketBinder(
            this.actionCardList,
            useActionCardIndex,
            selectActionCardLevel,
            selectWinActionCard);
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseActionCard(f: (card: ActionCardYamlData) => DestructionFlag) {
        this.useActionCardCallback = f;
    }


    //ドローするカードのレベルが選択されたときに呼ばれる関数をセット
    onSelectActionCardLevel(f: (level: number) => void) {
        this.selectActionCardLevelCallback = f;
    }

    //ドローするレベル6カードが選択された時に呼ばれる関数をセット
    onSelectWinActionCard(f: (cardName: string) => void) {
        this.selectWinActionCardCallback = f;
    }

    //手札がいっぱいかどうか
    is_full() {
        return this.actionCardList.Value.find(x => x == null) === undefined;
    }

    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1)
            throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }

    clear() {
        this.actionCardList.Value = [null, null, null, null, null];
    }
}
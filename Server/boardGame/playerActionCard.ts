import { SocketBinder } from "../socketBinder";
import { ActionCardYamlData } from "../../Client/src/Share/Yaml/actionCardYamlData";
import { GenerateActionCardYamlData } from "../../Client/src/Share/Yaml/actionCardYamlDataGen";
import { UseHandActionCard, UseKind } from "../../Client/src/Share/useHandActionCard";
import { yamlGet } from "../yamlGet";
import { ActionHash } from "../hashData";

//カードを破棄するかのフラグ
type DestructionFlag = boolean;

export class PlayerActionCard {
    private actionCardList: SocketBinder.BinderList<string | null>;
    private useActionCardCallback: (
        card: ActionCardYamlData
    ) => DestructionFlag;
    private destructionActionCardCallback: (
        card: ActionCardYamlData
    ) => DestructionFlag;

    private selectActionCardLevelCallback: (level: number) => void;
    private selectWinActionCardCallback: (cardName: string) => void;

    constructor(playerId: number, boardSocketManager: SocketBinder.Namespace) {
        //生成
        const selectActionCardLevel = new SocketBinder.EmitReceiveBinder<
            number
        >("selectActionCardLevel", true, [`player${playerId}`]);
        const selectWinActionCard = new SocketBinder.EmitReceiveBinder<string>(
            "selectWinCard",
            true,
            [`player${playerId}`]
        );
        this.actionCardList = new SocketBinder.BinderList<string | null>(
            "actionCardList",
            true,
            [`player${playerId}`]
        );
        const useHandActionCard = new SocketBinder.EmitReceiveBinder<UseHandActionCard>(
            "useHandActionCard",
            true,
            [`player${playerId}`]
        );

        selectActionCardLevel.OnReceive(level =>
            this.selectActionCardLevelCallback(level)
        );
        selectWinActionCard.OnReceive(cardName =>
            this.selectWinActionCardCallback(cardName)
        );
        useHandActionCard.OnReceive(handActionCard => {
            const useActionCardName = this.actionCardList.Value[
                handActionCard.index
            ];
            if (useActionCardName) {
                const useActionCard = ActionHash[useActionCardName];
                if (useActionCard === undefined) return;
                if (handActionCard.useKind == UseKind.Use && this.useActionCardCallback(useActionCard))
                    this.actionCardList.setAt(handActionCard.index, null);
                if (handActionCard.useKind == UseKind.Destruction &&
                    this.destructionActionCardCallback(useActionCard))
                    this.actionCardList.setAt(handActionCard.index, null);
            }
        });

        //初期化
        this.actionCardList.Value = [null, null, null, null, null];

        //socketBinder登録
        boardSocketManager.addSocketBinder(
            this.actionCardList,
            useHandActionCard,
            selectActionCardLevel,
            selectWinActionCard
        );
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseActionCard(f: (card: ActionCardYamlData) => DestructionFlag) {
        this.useActionCardCallback = f;
    }

    //カードが破棄されるときに呼ばれる関数をセット
    onDestructionActionCard(f: (card: ActionCardYamlData) => DestructionFlag) {
        this.destructionActionCardCallback = f;
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

    //全ての手札を破棄する
    throwAllCard() {
        this.actionCardList.Value.forEach((cardName, idx) => {
            if (cardName === null) return;
            const cardData = ActionHash[cardName];
            if (cardData === undefined) return;
            if (this.destructionActionCardCallback(cardData))
                this.actionCardList.setAt(idx, null);
        })
    }


    drawActionCard(card: ActionCardYamlData) {
        const index = this.actionCardList.Value.findIndex(x => x == null);
        if (index == -1) throw "手札がいっぱいです";
        this.actionCardList.setAt(index, card.name);
    }

    clear() {
        this.actionCardList.Value = [null, null, null, null, null];
    }
}

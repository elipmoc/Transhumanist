import { BindParams } from "../bindParams";
import { DeclareWarButton } from "../views/declareWarButton";
import { LayerTag } from "../../board";
import { DeclareWarDialog } from "../views/declareWarDialog";
import { WarLineControl } from "../views/warLine";
import { DeclareWarSelectButton } from "../views/declareWarSelectButton";

//宣戦布告ボタン生成
export function build(bindParams: BindParams) {
    const declareWarDialog = new DeclareWarDialog();
    bindParams.layerManager.add(LayerTag.PopUp, declareWarDialog);
    const declareWarSelectButton = new DeclareWarSelectButton(bindParams);

    declareWarDialog.visible = false;
    declareWarDialog.onClick(() => {
        declareWarDialog.visible = false;
        declareWarSelectButton.visible = false;
        console.log("反応してるよ！");
        bindParams.layerManager.update();
    });

    declareWarSelectButton.visible = false;
    declareWarSelectButton.OnselectedWarTarget((playerId: number, targetId: number) => {
        let warPair: number[] = [playerId, targetId];

        //ここで2つの引数で配列を作る。
        //このemitには引数で作ったjsonを添える。
        console.log(JSON.stringify(warPair));
        bindParams.socket.emit("declareWar",JSON.stringify(warPair));
    });

    const declareWarButton =
        new DeclareWarButton(
            () => {
                declareWarDialog.visible = true;
                declareWarSelectButton.visible = true;
                bindParams.layerManager.update();
            },
            bindParams.imgQueue
        );
    bindParams.layerManager.add(LayerTag.Ui, declareWarButton);
    bindParams.layerManager.add(LayerTag.Ui, declareWarSelectButton);

}
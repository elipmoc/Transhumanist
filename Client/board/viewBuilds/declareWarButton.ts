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
    declareWarSelectButton.OnselectedWarTarget(() => {
        //どうせこれconsole.logしかださないし。

        //本当は、自分のplayerIdと、相手のplayerIdを引数に取る。

        //ここで2つの引数で連想配列を作る。
        //このemitには引数で作ったjsonを添える。
        console.log("click");
        bindParams.socket.emit("declareWar");
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
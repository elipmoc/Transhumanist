import { BindParams } from "../bindParams";
import { DeclareWarButton } from "../views/declareWarButton";
import { LayerTag } from "../../board";
import { DeclareWarDialog } from "../views/declareWarDialog";

//宣戦布告ボタン生成
export function build(bindParams: BindParams) {
    const declareWarDialog = new DeclareWarDialog();
    bindParams.layerManager.add(LayerTag.PopUp, declareWarDialog);

    declareWarDialog.visible = false;
    declareWarDialog.onClick(() => {
        declareWarDialog.visible = false;
        console.log("反応してるよ！");
        bindParams.layerManager.update();
    });

    const declareWarButton =
        new DeclareWarButton(
            () => {
                declareWarDialog.visible = true;
                bindParams.layerManager.update();

                //どうせこれconsole.logしかださないし。
                bindParams.socket.emit("declareWarButtonClick")
            },
            bindParams.imgQueue
        );
    bindParams.layerManager.add(LayerTag.Ui, declareWarButton);
}
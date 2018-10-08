import { BindParams } from "../bindParams";
import { DeclareWarButton } from "../views/declareWarButton";
import { DeclareWarDialog } from "../views/declareWarDialog";

//宣戦布告ボタン生成
export function build(bindParams: BindParams, declareWarDialog: DeclareWarDialog) {
    declareWarDialog.visible = false;
    declareWarDialog.onClick(() => {
        declareWarDialog.visible = false;
        console.log("反応してるよ！");
        bindParams.stage.update();
    });

    const declareWarButton =
        new DeclareWarButton(
            () => { 
                declareWarDialog.visible = true;
                bindParams.stage.update();

            //どうせこれconsole.logしかださないし。
                bindParams.socket.emit("declareWarButtonClick") 
            },
            bindParams.imgQueue
            );
    bindParams.stage.addChild(declareWarButton);
}
import { BindParams } from "../bindParams";
import { DeclareWarButton } from "../views/declareWarButton";

//宣戦布告ボタン生成
export function build(bindParams: BindParams) {
    const declareWarButton =
        new DeclareWarButton(
            () => bindParams.socket.emit("declareWarButtonClick"),
            bindParams.imgQueue
        );
    bindParams.stage.addChild(declareWarButton);
}
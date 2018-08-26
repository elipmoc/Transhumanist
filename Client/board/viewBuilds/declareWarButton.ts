import { BindParams } from "../bindParams";
import * as view from "../view";

//宣戦布告ボタン生成
export function build(bindParams: BindParams) {
    const declareWarButton =
        new view.DeclareWarButton(
            () => bindParams.socket.emit("declareWarButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(declareWarButton);
}
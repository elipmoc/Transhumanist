import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";

//何かしら不都合が起きた時のダイアログ
export class NowEventDialog extends createjs.Container {
    constructor() {
        super();
        const width = 560;
        const height = 100;
        const background = new createjs.Shape(new createjs.Graphics().beginFill("gray")
            .drawRect(global.canvasWidth / 2 - width / 2, global.canvasHeight / 2 - height / 2, width, height));

        const label = new createjs.Text("他のプレイヤーのイベント処理中です。\nしばらくお待ちください。");
        label.font = "28px Bold ＭＳ ゴシック";
        label.color = "white";
        label.shadow = createMyShadow();
        label.textAlign = "center";
        label.x = global.canvasWidth / 2;
        label.y = global.canvasHeight / 2 - 40;

        this.addChild(background, label);
    }
}
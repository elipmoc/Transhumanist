import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { PopupWindowBase } from "./bases/popupWindowBase";

//何かしら不都合が起きた時のダイアログ
export class NowEventDialog extends PopupWindowBase {
    constructor() {
        super(560, 100);

        const label = new createjs.Text("他のプレイヤーのイベント処理中です。\nしばらくお待ちください。");
        label.font = "28px Bold ＭＳ ゴシック";
        label.color = "white";
        label.shadow = createMyShadow();
        label.textAlign = "center";
        label.x = global.canvasWidth / 2;
        label.y = global.canvasHeight / 2 - 40;

        this.addChild(label);
    }
}
import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";
import { PopupWindowBase } from "./bases/popupWindowBase";

//戦争相手選択しろのダイアログ
export class DeclareWarDialog extends PopupWindowBase {
    private label: createjs.Text;
    private callBack: () => void;
    onClick(callBack: () => void) {
        this.callBack = callBack;
    }
    constructor() {
        super(500, 250);
        this.label = new createjs.Text("宣戦布告相手の選んでください。\nプレイヤー欄を直接クリックして\n決定します。");
        this.label.font = "28px Bold ＭＳ ゴシック";
        this.label.color = "white";
        this.label.shadow = createMyShadow();
        this.label.textAlign = "center";
        this.label.x = global.canvasWidth / 2;
        this.label.y = global.canvasHeight / 2 - 100;
        const button = new DecisionButton("やめる");
        button.x = global.canvasWidth / 2;
        button.y = global.canvasHeight / 2 + this.getHeight() / 2 - 30 - button.height / 2;
        button.addEventListener("click", () => this.callBack());
        this.addChild(this.label, button);
    }
}
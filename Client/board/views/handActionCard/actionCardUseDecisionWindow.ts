import { global } from "../../../boardGlobalData";
import { createMyShadow } from "../../../utility";
import { DecisionButton } from "../decisionButton";
import { PopupWindowBase } from "../bases/popupWindowBase";

export const enum DialogResult {
    Yes,
    No,
    Destruction
}
export type ResultFunc = (r: DialogResult) => void;

//アクションカードを使用するかの最終確認ウインドウ
export class ActionCardUseDecisionWindow extends PopupWindowBase {
    private label: createjs.Text;
    private callBack: ResultFunc;
    private cardName: string;
    constructor() {
        super(500, 250);
        this.label = new createjs.Text("undefined");
        this.label.font = "32px Bold ＭＳ ゴシック";
        this.label.color = "white";
        this.label.shadow = createMyShadow();
        this.label.textAlign = "center";
        this.label.x = global.canvasWidth / 2;
        this.label.y = global.canvasHeight / 2 - 100;

        const use = new DecisionButton("使用");
        use.x = global.canvasWidth / 2 - this.getWidth() / 2 + 30 + use.width / 2;
        use.y = global.canvasHeight / 2 + this.getHeight() / 2 - 30 - use.height / 2 - 50;
        use.addEventListener("click", () => this.callBack(DialogResult.Yes));

        const destruction = new DecisionButton("破棄");
        destruction.x = global.canvasWidth / 2 + this.getWidth() / 2 - 30 - destruction.width / 2;
        destruction.y = global.canvasHeight / 2 + this.getHeight() / 2 - 30 - use.height / 2 - 50;
        destruction.addEventListener("click", () => this.callBack(DialogResult.Destruction));

        const no = new DecisionButton("やめる");
        no.x = global.canvasWidth / 2;
        no.y = global.canvasHeight / 2 + this.getHeight() / 2 - 30 - use.height / 2 + 20;
        no.addEventListener("click", () => this.callBack(DialogResult.No));
        this.addChild(this.label, use, destruction, no);
    }
    set CardName(name: string) {
        this.label.text = `${name}をどうする？`;
        this.cardName = name;
    }
    get CardName() { return this.cardName; }

    onClicked(callBack: ResultFunc) {
        this.callBack = callBack;
    }

}
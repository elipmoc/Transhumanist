import * as global from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ActionIndex } from "../../../Share/Yaml/actionCardYamlData";

class DecisionButton extends createjs.Container {
    readonly width = 150;
    readonly height = 50;
    constructor(_text: string) {
        super();
        const background = new createjs.Shape(new createjs.Graphics().beginFill("white").drawRect(-this.width / 2, -this.height / 2, this.width, this.height));
        const text = new createjs.Text(_text);
        text.color = "black";
        text.textAlign = "center";
        text.font = "32px Bold ＭＳ ゴシック";
        text.y = -20;
        this.addChild(background);
        this.addChild(text);
    }
}

export const enum DialogResult {
    Yes,
    No
}
export type ResultFunc = (r: DialogResult) => void;

//アクションカードを使用するかの最終確認ウインドウ
export class ActionCardUseDecisionWindow extends createjs.Container {
    private label: createjs.Text;
    private callBack: ResultFunc;
    private cardName: string;
    private cardIndex: number;
    constructor() {
        super();
        const width = 500;
        const height = 250;
        const background = new createjs.Shape(new createjs.Graphics().beginFill("gray")
            .drawRect(global.canvasWidth / 2 - width / 2, global.canvasHeight / 2 - height / 2, width, height));
        this.label = new createjs.Text("undefined");
        this.label.font = "32px Bold ＭＳ ゴシック";
        this.label.color = "white";
        this.label.shadow = createMyShadow();
        this.label.textAlign = "center";
        this.label.x = global.canvasWidth / 2;
        this.label.y = global.canvasHeight / 2 - 100;
        const yes = new DecisionButton("はい");
        yes.x = global.canvasWidth / 2 - width / 2 + 30 + yes.width / 2;
        yes.y = global.canvasHeight / 2 + height / 2 - 30 - yes.height / 2;
        yes.addEventListener("click", () => this.callBack(DialogResult.Yes));
        const no = new DecisionButton("いいえ");
        no.x = global.canvasWidth / 2 + width / 2 - 30 - no.width / 2;
        no.y = global.canvasHeight / 2 + height / 2 - 30 - yes.height / 2;
        no.addEventListener("click", () => this.callBack(DialogResult.No));
        this.addChild(background, this.label, yes, no);
    }
    set CardName(name: string) {
        this.label.text = `${name}を使用する？`;
        this.cardName = name;
    }
    get CardName() { return this.cardName; }

    set CardIndex(index: number) {
        this.cardIndex = index;
    }
    get CardIndex() { return this.cardIndex; }

    onClicked(callBack: ResultFunc) {
        this.callBack = callBack;
    }

}
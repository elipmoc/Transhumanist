import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";

export class SelectChurchWindow extends createjs.Container {
    private cardName = new createjs.Text();
    private callBack: () => void;
    private commandCallback: (id:number) => void;
    private commandButton: selectCommand[] = [
        new selectCommand("1つ『人間』を1つ消費して『信者』を1つ得る。"),
        new selectCommand("信者の数分、P点・N点を増減出来る。")
    ];

    constructor() {
        super();

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 400;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        this.cardName.textAlign = "center";
        this.cardName.text = "教会";
        this.cardName.font = "20px Bold ＭＳ ゴシック";
        this.cardName.color = "white";
        this.cardName.shadow = createMyShadow();
        this.cardName.x = global.canvasWidth / 2;
        this.cardName.y = global.canvasHeight / 2 - 180;

        const description = new createjs.Text("効果を選択してください。");
        description.textAlign = "center";
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 130;
        description.font = "20px ＭＳゴシック";
        description.color = "white";
        description.shadow = createMyShadow();

        const button = new DecisionButton("やめる");
        button.x = global.canvasWidth / 2;
        button.y = global.canvasHeight / 2 + 120;
        button.addEventListener("click", () => this.callBack());
        
        this.addChild(frame);
        this.addChild(description);
        this.addChild(this.cardName, button);

        this.commandButton.forEach((e, i) => {
            e.x = global.canvasWidth / 2;
            e.y = global.canvasHeight / 2 - (-10 + 40 * (i == 0 ? -1 : 1));
            e.addEventListener("click", () => this.commandCallback(i));
            this.addChild(e);
        });
    }

    closeOnClick(callBack: () => void) {
        this.callBack = callBack;
    }

    commandOnClick(callback: (num: number) => void) {
        this.commandCallback = (id:number) => { callback(id) };
    }

}

class selectCommand extends createjs.Container {
    readonly width = 650;
    readonly height = 50;

    constructor(_text:string) {
        super();

        const background = new createjs.Shape(new createjs.Graphics().beginFill("white").drawRect(-this.width / 2, -this.height / 2, this.width, this.height));
        const text = new createjs.Text(_text);
        text.color = "black";
        text.textAlign = "center";
        text.font = "28px Bold ＭＳ ゴシック";
        text.y = -20;
        this.addChild(background);
        this.addChild(text);

        this.alpha = 0.7;
        this.addEventListener("mouseover", () => { this.alpha = 1.0; this.stage.update(); });
        this.addEventListener("mouseout", () => { this.alpha = 0.7; this.stage.update(); });
    }
}
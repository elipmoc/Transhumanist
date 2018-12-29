import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";

export class SelectBelieverWindow extends createjs.Container {
    private commandCallback: (pnId: number, adId: number) => void;
    private buttons: DecisionButton[] = [
        //上の段
        new DecisionButton("増やす"), new DecisionButton("増やす"),
        //下の段
        new DecisionButton("減らす"), new DecisionButton("減らす")
    ];

    constructor() {
        super();

        const frame = new createjs.Shape();
        const frameX = 580;
        const frameY = 320;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        const description = new createjs.Text("変動させたい数分の信者を選択し、\nボタンを選択してください。");
        description.textAlign = "center";
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 120;
        description.font = "20px ＭＳゴシック";
        description.color = "white";
        description.shadow = createMyShadow();

        this.addChild(frame);
        this.addChild(description);

        const stateText: createjs.Text[] = [new createjs.Text("Positiveを"), new createjs.Text("Negativeを")];
        stateText.forEach((e, i) => {
            e.textAlign = "center";
            e.x = global.canvasWidth / 2;
            e.y = global.canvasHeight / 2 - 50;
            e.font = "28px ＭＳゴシック";
            e.shadow = createMyShadow();
            if (i == 0) {
                e.color = "#00ee00";
                e.x = e.x - 150;
            } else {
                e.color = "#ff0000";
                e.x = e.x + 150;
            }
            this.addChild(e);
        });

        this.buttons.forEach((button, i) => {
            button.x = global.canvasWidth / 2;
            button.y = global.canvasHeight / 2 + 50;

            if (Math.floor(i/2) == 0) button.y = button.y - 30;
            else button.y = button.y + 30;
            
            if (i % 2 == 0) button.x = button.x - 150;
            else button.x = button.x + 150;
            
            button.addEventListener("click", () => this.commandCallback(i % 2,Math.floor(i/2)));

            this.addChild(button);
        });
    }

    commandOnClick(callback: (pnId: number,adId:number) => void) {
        this.commandCallback = (pnId: number, adId: number) => { callback(pnId,adId) };
    }

}
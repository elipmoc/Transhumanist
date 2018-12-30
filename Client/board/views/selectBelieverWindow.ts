import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";

export class SelectBelieverWindow extends createjs.Container {
    private commandCallback: (pnId: number, adId: number) => void;
    private upCallback: () => void;
    private downCallback: () => void;
    private buttons: DecisionButton[] = [
        //上の段
        new DecisionButton("増やす"), new DecisionButton("増やす"),
        //下の段
        new DecisionButton("減らす"), new DecisionButton("減らす")
    ];
    private upDownButton: TriButton[] = [
        new TriButton(45), new TriButton(180 + 45)
    ];

    private changeNumber: number = 0;
    get ChangeNumber() {
        return this.changeNumber;
    }
    set ChangeNumber(num: number) {
        this.changeNumber = num;
    }
    private displayNumber: createjs.Text;

    constructor() {
        super();

        const frame = new createjs.Shape();
        const frameX = 580;
        const frameY = 320;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        const description = new createjs.Text("変動させたい分の数を選択し、\nボタンを選択してください。");
        description.textAlign = "center";
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 140;
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
                e.x = e.x - 180;
            } else {
                e.color = "#ff0000";
                e.x = e.x + 180;
            }
            this.addChild(e);
        });

        this.buttons.forEach((button, i) => {
            button.x = global.canvasWidth / 2;
            button.y = global.canvasHeight / 2 + 50;

            if (Math.floor(i / 2) == 0) button.y = button.y - 30;
            else button.y = button.y + 30;

            if (i % 2 == 0) button.x = button.x - 180;
            else button.x = button.x + 180;

            button.addEventListener("click", () => this.commandCallback(i % 2, Math.floor(i / 2)));

            this.addChild(button);
        });

        this.upDownButton.forEach((e, i) => {
            e.x = global.canvasWidth / 2;
            e.y = global.canvasHeight / 2 + 30;

            if (i == 0) {
                e.y = e.y - 110;
                e.addEventListener("click", () => this.upCallback());
            } else {
                e.y = e.y + 110;
                e.addEventListener("click", () => this.downCallback());
            }
            this.addChild(e);
        });

        const textBase = new createjs.Shape();
        textBase.graphics.beginFill("white").
            drawRect(0, 0, 100, 100);
        textBase.x = global.canvasWidth / 2 - 100 / 2;
        textBase.y = global.canvasHeight / 2 - 100 / 2 + 30;
        this.addChild(textBase);

        this.displayNumber = new createjs.Text("0");
        this.displayNumber.color = "black";
        this.displayNumber.textAlign = "center";
        this.displayNumber.font = "40px ＭＳゴシック";
        this.displayNumber.x = global.canvasWidth / 2;
        this.displayNumber.y = global.canvasHeight / 2 + 10;
        this.addChild(this.displayNumber);
    }

    commandOnClick(callback: (pnId: number, adId: number) => void) {
        this.commandCallback = (pnId: number, adId: number) => { callback(pnId, adId) };
    }

    upOnClick(f: () => void) {
        this.upCallback = f;
    }

    downOnClick(f: () => void) {
        this.downCallback = f;
    }

    updateNum() {
        this.displayNumber.text = this.changeNumber.toString();
    }
}

class TriButton extends createjs.Container {
    constructor(rotate: number) {
        super();
        const obj = new createjs.Shape();
        obj.graphics.beginFill("white"); // 赤色で描画するように設定
        obj.graphics.moveTo(0, 0);
        obj.graphics.lineTo(50, 0);
        obj.graphics.lineTo(0, 50);
        obj.graphics.lineTo(0, 0);
        obj.rotation = rotate;
        this.addChild(obj);
    }
}
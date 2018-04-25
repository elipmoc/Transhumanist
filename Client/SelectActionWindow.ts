import * as global from "./boardGlobalData"

//獲得するアクションカードを選択するウインドウ
export class SelectActionWindow extends createjs.Container {

    private callBack: (value: number) => void;

    constructor(queue: createjs.LoadQueue) {
        super();
        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 250;
        frame.graphics.beginFill("white").
            drawRect(0, 0, frameX, frameY);
        frame.alpha = 0.5;
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        const descriptionText = new createjs.Text();
        descriptionText.textAlign = "center";
        descriptionText.text = "獲得するアクションカードを選択してください。";
        descriptionText.font = "16px Bold ＭＳ ゴシック";
        descriptionText.color = "white";
        descriptionText.x = global.canvasWidth / 2;
        descriptionText.y = global.canvasHeight / 2 - 100;

        this.addChild(frame);
        this.addChild(descriptionText);

        for (var i = 1; i <= 3; i++) {
            const level = new createjs.Bitmap(queue.getResult("level" + (4 - i)));
            level.y = global.canvasHeight / 2 - 40;
            level.x = global.canvasWidth / 2 - (level.image.width + 20) * (i) + 10;
            const levelValue = 4 - i;
            level.addEventListener("click", () => this.callBack(levelValue));
            this.addChild(level);
        }

        for (var i = 4; i <= 6; i++) {
            const level = new createjs.Bitmap(queue.getResult("level" + i));
            level.y = global.canvasHeight / 2 - 40;
            level.x = global.canvasWidth / 2 + (level.image.width + 20) * (i - 4) + 10;
            const levelValue = i;
            level.addEventListener("click", () => this.callBack(levelValue));
            this.addChild(level);
        }
    }
    onSelectedLevel(callBack: (value: number) => void) {
        this.callBack = callBack;
    }
}
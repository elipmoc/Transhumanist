import * as global from "../../boardGlobalData"
import * as viewBase from "./viewBase"

//ターン終了ボタン
export class TurnFinishButton extends viewBase.ButtonBase {

    private turnFinishText: createjs.Text;

    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {

        //ターン終了ボタン画像
        const turnFinishButton = new createjs.Bitmap(queue.getResult("button"));
        turnFinishButton.regX = turnFinishButton.image.width;
        turnFinishButton.regY = turnFinishButton.image.height;
        turnFinishButton.x = global.canvasWidth - 20;
        turnFinishButton.y = global.canvasHeight - 20;
        super(turnFinishButton, onClickCallback);
        //ターン終了ボタンテキスト
        this.turnFinishText = new createjs.Text("", "20px Arial");
        this.turnFinishText.textAlign = "center";
        this.turnFinishText.regY = this.turnFinishText.getMeasuredHeight() / 2;
        this.turnFinishText.x = turnFinishButton.x - turnFinishButton.image.width / 2;
        this.turnFinishText.y = turnFinishButton.y - turnFinishButton.image.height / 2;
        this.addChild(this.turnFinishText);
    }
    setText(text: string) {
        this.turnFinishText.text = text;
    }
}
import * as viewBase from "./viewBase"
import * as global from "../../boardGlobalData"


//宣戦布告ボタン
export class DeclareWarButton extends viewBase.ButtonBase {
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        //ボタン画像
        const declareWarButton = new createjs.Bitmap(queue.getResult("button"));
        declareWarButton.regX = 0;
        declareWarButton.regY = declareWarButton.image.height;
        declareWarButton.x = 20;
        declareWarButton.y = global.canvasHeight - 20;
        super(declareWarButton, onClickCallback);

        //ボタンテキスト
        const declareWarText = new createjs.Text("宣戦布告/降伏", "20px Arial");
        declareWarText.regX = declareWarText.getMeasuredWidth() / 2;
        declareWarText.regY = declareWarText.getMeasuredHeight() / 2;
        declareWarText.x = declareWarButton.x + declareWarButton.image.width / 2;
        declareWarText.y = declareWarButton.y - declareWarButton.image.height / 2;
        this.addChild(declareWarText);
    }
}
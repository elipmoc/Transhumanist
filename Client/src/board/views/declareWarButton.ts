import { ButtonBase } from "./bases/buttonBase"
import { global } from "../../boardGlobalData"
import { ImageQueue } from "../imageQueue";


//宣戦布告ボタン
export class DeclareWarButton extends ButtonBase {
    private declareWarText: createjs.Text;
    set Text(val: string) {
        this.declareWarText.text = val;
    }

    constructor(onClickCallback: () => void, queue: ImageQueue) {
        //ボタン画像
        const declareWarButton = queue.getImage("button");
        declareWarButton.regX = 0;
        declareWarButton.regY = declareWarButton.image.height;
        declareWarButton.x = 20;
        declareWarButton.y = global.canvasHeight - 20;
        super(declareWarButton, onClickCallback);

        //ボタンテキスト
        this.declareWarText = new createjs.Text("宣戦布告", "20px Arial");
        this.declareWarText.textAlign = "center";
        this.declareWarText.regY = this.declareWarText.getMeasuredHeight() / 2;
        this.declareWarText.x = declareWarButton.x + declareWarButton.image.width / 2;
        this.declareWarText.y = declareWarButton.y - declareWarButton.image.height / 2;
        this.addChild(this.declareWarText);
    }
}
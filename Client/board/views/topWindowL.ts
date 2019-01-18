import { OptionWindow } from "./optionWindow";
import { SettingButton } from "./settingButton";
import { ImageQueue } from "../imageQueue";

//左上のやーつ
export class TopWindowL extends createjs.Container {
    //ターン表示テキスト
    private text: createjs.Text;

    constructor(queue: ImageQueue, optionWindow: OptionWindow) {
        super();
        //設定枠
        let topWindowsL = queue.getImage("topWindows");
        this.addChild(topWindowsL);
        //設定ボタン
        const settingButton = new SettingButton(() => { optionWindow.visible = !optionWindow.visible; this.stage.update(); }, queue);
        settingButton.x = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        settingButton.y = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        this.addChild(settingButton);
        this.text = new createjs.Text("ターン", "32px Arial");
        this.text.color = "white";
        this.text.textAlign = "center";
        this.text.regY = this.text.getMeasuredHeight() / 2;
        this.text.x = topWindowsL.x + topWindowsL.image.width / 2 + 20;
        this.text.y = topWindowsL.y + topWindowsL.image.height / 2 - 10;
        this.addChild(this.text);
    }
    setTurn(turn: number) {
        this.text.text = `ターン${turn}`;
    }
}
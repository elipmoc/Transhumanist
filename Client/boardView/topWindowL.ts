import * as view from "../boardView/view";
import { OptionWindow } from "./optionWindow";

//左上のやーつ
export class TopWindowL extends createjs.Container {
    constructor(queue: createjs.LoadQueue, optionWindow: OptionWindow) {
        super();
        //設定枠
        let topWindowsL = new createjs.Bitmap(queue.getResult("topWindows"));
        this.addChild(topWindowsL);
        //設定ボタン
        const settingButton = new view.SettingButton(() => { optionWindow.visible = true; this.stage.update(); }, queue);
        settingButton.x = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        settingButton.y = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        this.addChild(settingButton);
        const text = new createjs.Text("ターン 99", "32px Arial");
        text.color = "white";
        text.textAlign = "center";
        text.regY = text.getMeasuredHeight() / 2;
        text.x = topWindowsL.x + topWindowsL.image.width / 2 + 20;
        text.y = topWindowsL.y + topWindowsL.image.height / 2 - 10;
        this.addChild(text);
    }
}
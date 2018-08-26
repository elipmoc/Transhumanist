import { OptionWindow } from "../optionWindow";
import { TopWindowL } from "../topWindowL";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import * as global from "../../boardGlobalData";

//左上のやつ生成
export function build(bindParams: BindParams) {
    //オプションウインドウ生成
    const optionWindow = new OptionWindow(bindParams.queue);
    optionWindow.x = global.canvasWidth / 2;
    optionWindow.y = global.canvasHeight / 2;
    optionWindow.visible = false;
    bindParams.stage.addChild(optionWindow);

    //左上のやつ生成
    const topWindowL = new TopWindowL(bindParams.queue, optionWindow);
    const turn = new SocketBinder<number>("turn", bindParams.socket);
    turn.onUpdate(x => topWindowL.setTurn(x));
    bindParams.stage.addChild(topWindowL);
}
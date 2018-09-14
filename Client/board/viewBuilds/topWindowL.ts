import { OptionWindow } from "../views/optionWindow";
import { TopWindowL } from "../views/topWindowL";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { global } from "../../boardGlobalData";

//左上のやつ生成
export function build(bindParams: BindParams) {
    //オプションウインドウ生成
    const optionWindow = new OptionWindow(bindParams.imgQueue);
    optionWindow.x = global.canvasWidth / 2;
    optionWindow.y = global.canvasHeight / 2;
    optionWindow.visible = false;
    bindParams.stage.addChild(optionWindow);

    //左上のやつ生成
    const topWindowL = new TopWindowL(bindParams.imgQueue, optionWindow);
    const turn = new SocketBinder<number>("turn", bindParams.socket);
    turn.onUpdate(x => { topWindowL.setTurn(x); bindParams.stage.update(); });
    bindParams.stage.addChild(topWindowL);
}
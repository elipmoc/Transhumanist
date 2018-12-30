import { SelectEventWindow } from "../views/selectEventWindow";
import { BindParams } from "../bindParams";
import { FutureForecastEventData } from "../../../Share/futureForecastEventData";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";

//イベントカードウインドウの生成
export function build(bindParams: BindParams) {
    //const diceData = new SocketBinder<DiceData>("diceList" + bindParams.playerId, bindParams.socket);
    const selectEventWindow = new SelectEventWindow(() => { bindParams.layerManager.update() });
    bindParams.layerManager.add(LayerTag.PopUp, selectEventWindow);
    //selectEventWindow.visible = false;

    const data: FutureForecastEventData = {
        eventNameList: ["無風状態", "ムーアの法則", "ブラックホールの発生"]
    }

    selectEventWindow.setData(data.eventNameList);
    bindParams.layerManager.update();
    selectEventWindow.submitOnClick((list:string[]) => { 
        console.log(list);
    });
    
    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        selectEventWindow.visible = false;
        bindParams.layerManager.update();
    });
}
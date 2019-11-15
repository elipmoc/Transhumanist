import { BindParams } from "../bindParams";
import { WarLineControl } from "../views/warLine";
import { SocketBinderList } from "../../socketBinderList";
import { WarPair } from "../../../Share/warPair";
import { LayerTag } from "../../board";

//戦争ライン表示の生成
export function build(bindParams: BindParams) {
    const warPairList = new SocketBinderList<WarPair>("warPairList", bindParams.socket);
    const warLineControl = new WarLineControl();
    warPairList.onUpdate(xs => {
        warLineControl.deleteAllWarLine();
        xs.forEach(x => warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId));
        bindParams.layerManager.update();
    });
    warPairList.onPush(x => {
        warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId);
        bindParams.layerManager.update();
    });
    warPairList.onPop(x => {
        warLineControl.deleteWarLine(x.playerId1, x.playerId2);
        bindParams.layerManager.update();
    });
    bindParams.layerManager.add(LayerTag.UiUnder, warLineControl);
}
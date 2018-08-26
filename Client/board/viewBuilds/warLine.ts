import { BindParams } from "../bindParams";
import { WarLineControl } from "../warLine";
import { SocketBinderList } from "../../socketBinderList";
import { WarPair } from "../../../Share/warPair";

//戦争ライン表示の生成
export function build(bindParams: BindParams) {
    const warPairList = new SocketBinderList<WarPair>("warPairList", bindParams.socket);
    const warLineControl = new WarLineControl();
    warPairList.onUpdate(xs => {
        xs.forEach(x => warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId))
        bindParams.stage.update();
    });
    warPairList.onPush(x => {
        warLineControl.addWarLine(x.playerId1, x.playerId2, bindParams.playerId)
        bindParams.stage.update();
    });
    warPairList.onPop(x => {
        warLineControl.deleteWarLine(x.playerId1, x.playerId2)
        bindParams.stage.update();
    });
    bindParams.stage.addChild(warLineControl);
}
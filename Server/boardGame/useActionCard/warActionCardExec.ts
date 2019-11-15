import { ActionCardName } from "../../../Client/src/Share/Yaml/actionCardYamlData";
import { BuildActionList } from "../buildActionList";
import { ResourceList } from "../ResourceList";
import { GamePlayerState } from "../gamePlayerState";

//アクションカード効果発動の処理
export function warActionCardExec(
    name: ActionCardName,
    buildActionList: BuildActionList,
    resourceList: ResourceList,
    state: GamePlayerState
) {
    //実際の使用する処理
    switch (name) {
        case "ミサイル発射":
            buildActionList.randomDeleteBuildAction(1);
            //戦争相手の設置済みアクションを1つ破壊。
            break;
        case "細菌兵器":
            resourceList.changeResource(["人間", "信者"], "病人", Math.floor(Math.random() * 3) + 1);
            //戦争相手のリソースにある人間を、1～3人、病人に変える。
            break;
        case "神の杖":
            buildActionList.randomDeleteBuildAction(1);
            resourceList.randomDeleteResource(Math.floor(Math.random() * 3) + 2);
            //戦争相手の設置アクションを1つと、リソースを2～4個、破壊する。
            break;
    }

    //破壊系アクションの反映
    state.updateSpeed(buildActionList.getCount("量子コンピュータ"));
    resourceList.setHaveFusionReactor(buildActionList.getCount("核融合炉") >= 1);
}

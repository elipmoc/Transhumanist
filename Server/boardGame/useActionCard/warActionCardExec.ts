import { ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { BuildActionList } from "../buildActionList";
import { ResourceList } from "../ResourceList";

//アクションカード効果発動の処理
export function warActionCardExec(
    name: ActionCardName,
    buildActionList: BuildActionList,
    resourceList: ResourceList
) {
    //実際の使用する処理
    switch (name) {
        case "ミサイル発射":
            buildActionList.randomDeleteBuildAction(1);
            //戦争相手の設置済みアクションを1つ破壊。
            break;
        case "細菌兵器":
            resourceList.changeResource("人間", "病人", Math.floor(Math.random() * 3) + 1);
            //戦争相手のリソースにある人間を、1～3人、病人に変える。
            break;
        case "神の杖":
            buildActionList.randomDeleteBuildAction(1);
            resourceList.randomDeleteResource(Math.floor(Math.random() * 3) + 2);
            //戦争相手の設置アクションを1つと、リソースを2～4個、破壊する。
            break;
    }
}

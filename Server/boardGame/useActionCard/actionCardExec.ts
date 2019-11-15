import { ActionCardYamlData } from "../../../Client/src/Share/Yaml/actionCardYamlData";
import { BuildActionList } from "../buildActionList";
import { ResourceList } from "../ResourceList";
import { GamePlayerState } from "../gamePlayerState";

export enum ExecResult {
    Success,
    War,
    Win
}

//アクションカード効果発動の処理
export function actionCardExec(
    card: ActionCardYamlData,
    buildActionList: BuildActionList,
    resourceList: ResourceList,
    state: GamePlayerState
): ExecResult {
    //実際の使用する処理
    if (card.build_use) {
        buildActionList.addBuildAction(card.name);
        if (card.name == "倉庫") state.addResource(10);
        if (card.name == "量子コンピュータ") state.updateSpeed(buildActionList.getCount("量子コンピュータ"));
        if (card.name == "核融合炉") resourceList.setHaveFusionReactor(buildActionList.getCount("核融合炉") >= 1);
    }
    else {
        switch (card.name) {
            case "ロケットの開発":
                resourceList.addResource("ロケット");
                break;
            case "花火大会":
                state.addPositive(Math.floor(resourceList.getCount("人間") / 2));
                //P点がリソース内の人間の半分（切り捨て）の数増える
                break;
            case "布教活動":
                resourceList.changeResource(["人間"], "信者", 1);
                break;
            case "火星探査":
                resourceList.addResource("火星の情報");
                break;
            case "ミサイル発射":
                //戦争相手の設置済みアクションを1つ破壊。
                return ExecResult.War;
            case "衛星の打ち上げ":
                resourceList.addResource("衛星");
                break;
            case "チップの埋め込み":
                resourceList.addResource("拡張人間");
                break;
            case "細菌兵器":
                //戦争相手のリソースにある人間を、サイコロの数分、病人に変える。
                return ExecResult.War;
            case "テラフォーミング":
                resourceList.addResource("テラフォーミング");
                break;
            case "神の杖":
                //戦争相手の設置アクションを1つと、リソースをサイコロの数分破壊する。
                return ExecResult.War;
            case "意識操作のテスト":
                state.addNegative(-1);
                state.addPositive(1);
                resourceList.addResource("拡張人間");
                break;
            case "御神体の再生":
                resourceList.addResource("御神体");
                break;
            case "火星の支配":
            case "A.Iによる支配":
            case "宗教による支配":
                //勝利カードの処理
                return ExecResult.Win;
        }
    }
    return ExecResult.Success;
}

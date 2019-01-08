import { Event } from "../../../Share/Yaml/eventYamlData";
import { GamePlayerState } from "../gamePlayerState";
import { ResourceItem } from "../../../Share/Yaml/actionCardYamlData";
import { actionCardUseConditionCheck } from "./actionCardUseConditionCheck";
import { ResourceList } from "../ResourceList";
import { BuildActionList } from "../buildActionList";
import { UnavailableState } from "../../../Share/unavailableState";

//アクションカード、または設置したアクションカードの使用をする時の使用条件チェック
export function actionCardUseCheck(
    cost: ResourceItem[],
    conditions: string | undefined,
    warUse: boolean,
    warFlag: boolean,
    nowEvent: Event,
    state: GamePlayerState,
    onceNoCostFlag: boolean,
    resourceList: ResourceList,
    buildActionList: BuildActionList): UnavailableState | null {

    //イベントによる制約の処理
    if (
        nowEvent.name == "ニート化が進む" &&
        state.State.negative >= 2 &&
        cost.find(x => x.name == "人間")
    )
        return UnavailableState.Event;

    //使用コストの判定
    if (
        onceNoCostFlag == false &&
        resourceList.canCostPayment(cost) == false
    )
        return UnavailableState.Cost;

    //戦争条件の判定
    if (
        warUse &&
        warFlag == false &&
        (nowEvent.name == "世界大戦の開幕" && state.State.negative >= 1) ==
        false
    )
        return UnavailableState.War;

    //カード使用条件の判定
    if (actionCardUseConditionCheck(conditions, state, buildActionList) == false)
        return UnavailableState.Condition;

    return null;
}
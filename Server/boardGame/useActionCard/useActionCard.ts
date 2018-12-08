import { UnavailableState } from "../../../Share/unavailableState";
import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { GamePlayerState } from "../gamePlayerState";
import { ResourceList } from "../ResourceList";
import { actionCardUseConditionCheck } from "./actionCardUseConditionCheck";
import { actionCardExec } from "./actionCardExec";
import { BuildActionList } from "../buildActionList";

export function useActionCard(
    card: ActionCardYamlData,
    nowEvent: Event,
    state: GamePlayerState,
    onceNoCostFlag: boolean,
    resourceList: ResourceList,
    buildActionList: BuildActionList,
    warFlag: boolean
): UnavailableState | null {
    //イベントによる制約の処理
    if (
        nowEvent.name == "ニート化が進む" &&
        state.State.negative >= 2 &&
        card.cost.find(x => x.name == "人間")
    ) {
        return UnavailableState.Event;
    }

    //使用コストの判定
    if (
        onceNoCostFlag == false &&
        resourceList.canCostPayment(card.cost) == false
    ) {
        return UnavailableState.Cost;
    }

    //戦争条件の判定
    if (
        card.war_use &&
        warFlag == false &&
        (nowEvent.name == "世界大戦の開幕" && state.State.negative >= 1) ==
            false
    ) {
        return UnavailableState.War;
    }

    //カード使用条件の判定
    if (actionCardUseConditionCheck(card, state, buildActionList) == false) {
        return UnavailableState.Condition;
    }

    //アクションカード効果発動
    actionCardExec(card, buildActionList, resourceList, state);

    resourceList.costPayment(card.cost);

    return null;
}

import { UnavailableState } from "../../../Share/unavailableState";
import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { GamePlayerState } from "../gamePlayerState";
import { ResourceList } from "../ResourceList";
import { actionCardUseConditionCheck } from "./actionCardUseConditionCheck";
import { actionCardExec,ExecResult } from "./actionCardExec";
import { BuildActionList } from "../buildActionList";

export interface UseActionResult {
    cardName: string;
    warActionFlag: boolean;
    winActionFlag: boolean;
    unavailableState: UnavailableState | null;
}

export function useActionCard(
    card: ActionCardYamlData,
    nowEvent: Event,
    state: GamePlayerState,
    onceNoCostFlag: boolean,
    resourceList: ResourceList,
    buildActionList: BuildActionList,
    warFlag: boolean
): UseActionResult {
    const actionResult: UseActionResult = {
        cardName: card.name,
        warActionFlag: false,
        winActionFlag: false,
        unavailableState: null,
    }
    
    //イベントによる制約の処理
    if (
        nowEvent.name == "ニート化が進む" &&
        state.State.negative >= 2 &&
        card.cost.find(x => x.name == "人間")
    ) {
        actionResult.unavailableState = UnavailableState.Event;
        return actionResult;
    }

    //使用コストの判定
    if (
        onceNoCostFlag == false &&
        resourceList.canCostPayment(card.cost) == false
    ) {
        actionResult.unavailableState = UnavailableState.Cost;
        return actionResult;
    }

    //戦争条件の判定
    if (
        card.war_use &&
        warFlag == false &&
        (nowEvent.name == "世界大戦の開幕" && state.State.negative >= 1) ==
            false
    ) {
        actionResult.unavailableState = UnavailableState.War;
        return actionResult;
    }

    //カード使用条件の判定
    if (actionCardUseConditionCheck(card, state, buildActionList) == false) {
        actionResult.unavailableState = UnavailableState.Condition;
        return actionResult;
    }

    //アクションカード効果発動
    switch (actionCardExec(card, buildActionList, resourceList, state)) {
        case ExecResult.War:
            actionResult.warActionFlag = true;
            break;
        case ExecResult.Win:
            actionResult.winActionFlag = true;
            break;
        default:
            break;
    }

    if (onceNoCostFlag == false) resourceList.costPayment(card.cost);

    return actionResult;
}

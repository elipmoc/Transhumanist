import { UnavailableState } from "../../../Share/unavailableState";
import { ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { GamePlayerState } from "../gamePlayerState";
import { ResourceList } from "../ResourceList";
import { actionCardExec, ExecResult } from "./actionCardExec";
import { BuildActionList } from "../buildActionList";
import { actionCardUseCheck } from "./actionCardUseCheck";

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

    const checkResult = actionCardUseCheck(card.cost, card.conditions, card.war_use, warFlag, nowEvent, state, onceNoCostFlag, resourceList, buildActionList);
    if (checkResult != null) {
        actionResult.unavailableState = checkResult;
        return actionResult;
    }

    if (onceNoCostFlag == false) resourceList.costPayment(card.cost);

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

    return actionResult;
}

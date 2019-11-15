import { Event } from "../../../Client/src/Share/Yaml/eventYamlData";
import { SelectBuildActionData } from "../../../Client/src/Share/selectBuildActionData";
import { ActionCardYamlData, Trade, ResourceGuard, RandGet, CreateGet, Get } from "../../../Client/src/Share/Yaml/actionCardYamlData";
import { ResourceList } from "../ResourceList";
import { BuildActionList } from "../buildActionList";
import { UnavailableState } from "../../../Client/src/Share/unavailableState";
import { GamePlayerCondition } from "../../../Client/src/Share/gamePlayerCondition";
import { SocketBinder } from "../../socketBinder";
import { ChurchAction } from "../../../Client/src/Share/churchAction";
import { FutureForecastEventData } from "../../../Client/src/Share/futureForecastEventData";
import { getBuildActionCost } from "./getBuildActionCost";
import { actionCardUseCheck } from "./actionCardUseCheck";
import { GamePlayerState } from "../gamePlayerState";

export interface UseBuildActionResult {
    consumeFlag: boolean;
    unavailableState: UnavailableState | null;
}

export function useBuildActionCard(
    card: ActionCardYamlData,
    state: GamePlayerState,
    onceNoCostFlag: boolean,
    nowEvent: Event,
    futureEvents: Event[],
    data: SelectBuildActionData,
    resourceList: ResourceList,
    buildActionList: BuildActionList,
    playerCond: SocketBinder.Binder<GamePlayerCondition>,
    churchAction: SocketBinder.Binder<ChurchAction>,
    futureForecastGetEvents: SocketBinder.Binder<FutureForecastEventData | undefined>
) {

    const result: UseBuildActionResult = {
        consumeFlag: false,
        unavailableState: null
    };

    if (nowEvent.name == "太陽風") {
        result.unavailableState = UnavailableState.Event;
        return result;
    }
    //かかるコストを算出
    const costs = getBuildActionCost(card, data);

    //カードの使用条件のチェック
    const checkResult = actionCardUseCheck(costs, undefined, false, false, nowEvent, state, onceNoCostFlag, resourceList, buildActionList);
    if (checkResult != null) {
        result.unavailableState = checkResult;
        return result;
    }

    if (onceNoCostFlag == false) resourceList.costPayment(costs);

    const commandNum = data.selectCommandNum;
    switch (card.commands[commandNum].kind) {
        //未来予報装置
        case "future_forecast":
            const events = futureEvents;
            if (events.length == 0) {
                result.unavailableState = UnavailableState.Condition;
                return result;
            }
            playerCond.Value = GamePlayerCondition.Action;
            futureForecastGetEvents.Value = { eventNameList: events.slice(Math.max(events.length - 3, 0), events.length).map(event => event.name).reverse() };
            break;
        case "resource_guard":
            //保護するリソースの最大数
            const guardMaxNum = (<ResourceGuard>card.commands[commandNum].body).number * buildActionList.getCount(card.name);
            if (data.resourceIdList.length > guardMaxNum) {
                result.unavailableState = UnavailableState.Condition;
                return result;
            }
            resourceList.resetGuard();
            data.resourceIdList.forEach(x => {
                resourceList.setGuard(x);
            });
            return result;
        case "rand_get":
            const randData: RandGet = <RandGet>card.commands[commandNum].body;
            resourceList.addResource(randData.items[data.resourceIdList[0]].name);
            break;
        case "create_get":
            const createData: CreateGet = <CreateGet>card.commands[commandNum].body;
            createData.get.forEach(elem => {
                resourceList.addResource(elem.name, elem.number);
            });
            break;
        case "get":
            const getData: Get = <Get>card.commands[commandNum].body;
            resourceList.addResource(getData.items[0].name, getData.items[0].number);
            break;
        case "trade":
            const tradeData: Trade = <Trade>card.commands[commandNum].body;
            resourceList.changeResource([tradeData.from_item.name], tradeData.to_item.name, 1);
            break;
        case "missionary":
            if (resourceList.getCount("信者") >= 1) {
                churchAction.Value = {
                    maxNum: resourceList.getCount("信者"),
                    enable: true
                };
                playerCond.Value = GamePlayerCondition.Action;
            } else {
                result.unavailableState = UnavailableState.NoBeliever;
                return result;
            }
            break;
    }
    result.consumeFlag = true;
    return result;
}
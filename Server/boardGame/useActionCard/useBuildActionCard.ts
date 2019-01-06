import { Event } from "../../../Share/Yaml/eventYamlData";
import { SelectBuildActionData } from "../../../Share/selectBuildActionData";
import { ActionCardYamlData, Trade, ResourceGuard, RandGet, CreateGet, Get } from "../../../Share/Yaml/actionCardYamlData";
import { ResourceList } from "../ResourceList";
import { BuildActionList } from "../buildActionList";
import { UnavailableState } from "../../../Share/unavailableState";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { SocketBinder } from "../../socketBinder";
import { ChurchAction } from "../../../Share/churchAction";
import { FutureForecastEventData } from "../../../Share/futureForecastEventData";

export interface UseBuildActionResult {
    consumeFlag: boolean;
    unavailableState: UnavailableState | null;
}

export function useBuildActionCard(
    card: ActionCardYamlData,
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
            futureForecastGetEvents.Value = { eventNameList: events.slice(events.length - 3, events.length).map(event => event.name).reverse() };
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
            if (resourceList.canCostPayment(createData.cost)) {
                resourceList.costPayment(createData.cost);
                createData.get.forEach(elem => {
                    resourceList.addResource(elem.name, elem.number);
                });
            } else {
                result.unavailableState = UnavailableState.Cost;
                return result;
            }
            break;
        case "get":
            const getData: Get = <Get>card.commands[commandNum].body;
            resourceList.addResource(getData.items[0].name, getData.items[0].number);
            break;
        case "trade":
            const tradeData: Trade = <Trade>card.commands[commandNum].body;
            if (resourceList.canCostPayment(tradeData.cost_items)) {
                resourceList.costPayment(tradeData.cost_items);
                resourceList.changeResource(tradeData.from_item.name, tradeData.to_item.name, 1);
            } else {
                result.unavailableState = UnavailableState.Cost;
                return result;
            }
            break;
        case "missionary":
            if (resourceList.getCount("信者") >= 1) {
                churchAction.Value = {
                    maxNum: resourceList.getCount("信者"),
                    enable: true
                };
            } else {
                result.unavailableState = UnavailableState.NoBeliever;
                return result;
            }
            break;
    }
    result.consumeFlag = true;
    return result;
}
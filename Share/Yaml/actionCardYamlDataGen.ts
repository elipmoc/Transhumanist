import { ActionCardYamlData, Command, RandGet, CreateGet, CostTakeOver, ResourcePlus, ResourceGuard, Get, Trade, SpeedPlus, ResourceItem, ActionCardHash } from "./actionCardYamlData";
import { CheckUndefined } from "./check_func";


export function GenerateActionCardYamlData(data: ActionCardYamlData[]) {
    let actionCardHash: ActionCardHash = {};
    CheckUndefined(data.length, "最上位の式は配列ですか？");
    data.forEach((x, index) => {
        CheckUndefined(x.description, "descriptionがありませんよ？");
        CheckUndefined(x.build_use, "build_useがありませんよ？");
        CheckUndefined(x.commands, "commandsがありませんよ？");
        CheckUndefined(x.commands.length, "commandsは配列ですか？");
        x.commands.forEach(xx => {
            CheckCommand(xx);
        });
        CheckUndefined(x.cost, "constがありませんよ？");
        CheckUndefined(x.level, "levelがありませんよ？");
        CheckUndefined(x.name, "nameがありませんよ？");
        actionCardHash[x.name] = x;
        x.index = index;
    });
    return actionCardHash;
}

function CheckCommand(x: Command) {
    CheckUndefined(x.kind, "commandにkindがありませんよ？");
    switch (x.kind) {
        case "rand_get":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckRandGet(<RandGet>x.body);
            break;
        case "create_get":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckCreateGet(<CreateGet>x.body);
            break;
        case "cost_take_over":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckCostTakeOver(<CostTakeOver>x.body);
            break;
        case "resource_plus":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckResourcePlus(<ResourcePlus>x.body);
            break;
        case "resource_guard":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckResourceGuard(<ResourceGuard>x.body);
            break;
        case "get":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckGet(<Get>x.body);
            break;
        case "trade":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckTrade(<Trade>x.body);
            break;
        case "speed_plus":
            CheckUndefined(x.body, "commandにbodyがありませんよ？");
            CheckSpeedPlus(<SpeedPlus>x.body);
            break;
        case "human_p_plus":
        case "missile_start":
        case "missionary":
        case "bacterial_weapon":
        case "n_minus_p_plus":
        case "god_wand":
        case "win":
        case "future_forecast":
            break;
        default:
            throw "存在しないcommandが指定されました";
    }
}

function CheckItem(x: ResourceItem) {
    CheckUndefined(x.name, "itemにnameがありませんよ？");
    CheckUndefined(x.number, "itemにnumberがありませんよ？");
}

function CheckRandGet(x: RandGet) {
    CheckUndefined(x.select_number, "rand_getにselect_numberがありませんよ？");
    CheckUndefined(x.items, "rand_getにitemsがありませんよ？");
    CheckUndefined(x.items.length, "rand_getのitemsは配列ですか？");
    x.items.forEach(xx => CheckItem(xx));
}

function CheckCreateGet(x: CreateGet) {
    CheckUndefined(x.cost, "create_getにcostがありませんよ？");
    CheckUndefined(x.cost.length, "create_getのcostは配列ですか？");
    x.cost.forEach(xx => CheckItem(xx));
    CheckUndefined(x.get, "create_getにgetがありませんよ？");
    CheckUndefined(x.get.length, "create_getのgetは配列ですか？");
    x.get.forEach(xx => CheckItem(xx));
}

function CheckCostTakeOver(x: CostTakeOver) {
    CheckUndefined(x.name, "cost_take_overにnameがありませんよ？");
    CheckUndefined(x.max_cost, "cost_take_overにmax_costがありませんよ？");
}

function CheckResourcePlus(x: ResourcePlus) {
    CheckUndefined(x.add, "ResourcePlusにaddがありませんよ？");
}

function CheckResourceGuard(x: ResourceGuard) {
    CheckUndefined(x.number, "ResourceGuardにnumberがありませんよ？");
}

function CheckGet(x: Get) {
    CheckUndefined(x.items, "Getにitemsがありませんよ？");
    CheckUndefined(x.items.length, "Getのitemsは配列ですか？");
    x.items.forEach(xx => CheckItem(xx));
}

function CheckTrade(x: Trade) {
    CheckUndefined(x.cost_items.length, "Tradeのcost_itemsは配列ですか？");
    CheckUndefined(x.cost_items, "Tradeにcost_itemsがありませんよ？");
    x.cost_items.forEach(xx => CheckItem(xx));
    CheckUndefined(x.from_item, "Tradeにfrom_itemがありませんよ？");
    CheckUndefined(x.to_item, "Tradeにto_itemがありませんよ？");
}
function CheckSpeedPlus(x: SpeedPlus) {
    CheckUndefined(x.plus, "SpeedPlusにplusがありませんよ？");
}
import { ActionCardYamlData, CreateGet, Trade } from "../../../Share/Yaml/actionCardYamlData";
import { SelectBuildActionData } from "../../../Share/selectBuildActionData";

//設置したアクションカードの使用時のコストを取得
export function getBuildActionCost(card: ActionCardYamlData, data: SelectBuildActionData) {
    const commandNum = data.selectCommandNum;
    switch (card.commands[commandNum].kind) {
        case "create_get":
            const createData = <CreateGet>card.commands[commandNum].body;
            return createData.cost;
        case "trade":
            const tradeData = <Trade>card.commands[commandNum].body;
            return tradeData.cost_items;
    }
    return [];
}
import { ActionCardYamlData, CreateGet, Trade } from "../../../Client/src/Share/Yaml/actionCardYamlData";
import { SelectBuildActionData } from "../../../Client/src/Share/selectBuildActionData";

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
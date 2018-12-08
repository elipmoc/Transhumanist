export interface ActionCardHash {
    [index: string]: ActionCardYamlData | undefined;
}

export type BuildActionIndex = number;
export type ActionIndex = number;
export type ActionCardName = string;

export interface ActionCardYamlData {
    name: string;
    number: number; //枚数
    index: ActionIndex;
    level: number;
    build_use: boolean;
    description: string;
    cost: ResourceItem[];
    commands: Command[];
    war_use: boolean;
    conditions: string | undefined;
    conditionDescript: string;
}

export interface ResourceItem {
    name: string;
    number: number;
}

export interface Command {
    kind: string;
    body:
        | RandGet
        | CreateGet
        | CostTakeOver
        | ResourcePlus
        | ResourceGuard
        | Get
        | Trade
        | SpeedPlus;
}

export interface RandGet {
    select_number: 1;
    items: ResourceItem[];
}

export interface CreateGet {
    cost: ResourceItem[];
    get: ResourceItem[];
}

export interface CostTakeOver {
    name: string;
    max_cost: number;
}

export interface ResourcePlus {
    add: number;
}

export interface ResourceGuard {
    number: number;
}

export interface Get {
    items: ResourceItem[];
}

export interface Trade {
    cost_items: ResourceItem[];
    from_item: ResourceItem;
    to_item: ResourceItem;
}

export interface SpeedPlus {
    plus: number;
}

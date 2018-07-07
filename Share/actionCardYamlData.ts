export interface ActionCardYamlData {
    name: string;
    level: number;
    build_use: boolean;
    cost: ResourceItem[];
    commands: Command[];
}

export interface ResourceItem {
    name: string;
    number: number;
}

export interface Command {
    kind: string;
    body: RandGet | CreateGet | CostTakeOver;
}

export const commandList: string[] = ["rand_get", "create_get", "cost_take_over"];

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
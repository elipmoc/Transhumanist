import { CheckUndefined } from "./check_func";

export function GenerateEventYamlData(yamlData: Event[]) {
    CheckUndefined(yamlData.length, "eventのyamlが配列ではありません");
    let eventHash: EventHash = {};
    yamlData.forEach((x, index) => {
        CheckUndefined(x.name, "eventのyamlにnameがありません");
        CheckUndefined(x.description, "eventのyamlにdescriptionがありません");
        CheckUndefined(x.level, "eventのyamlにlevelがありません");
        CheckUndefined(x.forever, "eventのyamlにforeverがありません");
        x.index = index;
        eventHash[x.name] = x;
    });
    return eventHash;
}

export interface EventHash {
    [index: string]: Event | undefined;
}
export type EventIndex = number;

export interface Event {
    name: string,
    index: EventIndex,
    level: number,
    description: string,
    forever: boolean
}
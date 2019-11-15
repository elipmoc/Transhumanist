import { CheckUndefined } from "./check_func";

export interface StartStatusYamlData {
    name: string;
    speed: number;
    resource: number;
    activityRange: number;
    uncertainty: number;
}

export function GenerateStartStatusYamlData(data: StartStatusYamlData[]) {
    CheckUndefined(data.length, "最上位の式は配列ですか？");
    data.forEach(x => {
        CheckUndefined(x.name, "nameがありませんよ？");
        CheckUndefined(x.speed, "speedがありませんよ？");
        CheckUndefined(x.activityRange, "activityRangeがありませんよ？");
        CheckUndefined(x.resource, "resourceは配列ですか？");
        CheckUndefined(x.uncertainty, "uncertaintyがありませんよ？");
    });
    return data;
}
import { CheckUndefined } from "./check_func";

export function GenerateResourceYamlData(yamlData: ResourceYamlData[]) {
    CheckUndefined(yamlData.length, "resourceのyamlが配列ではありません");
    let resourceHash: ResourceHash = {};
    yamlData.forEach((x, index) => {
        CheckUndefined(x.name, "resourceのyamlにnameがありません");
        CheckUndefined(x.description, "resourceのyamlにdescriptionがありません");
        CheckUndefined(x.level, "resourceのyamlにlevelがありません");
        x.index = index;
        resourceHash[x.name] = x;
    });
    return resourceHash;
}

export interface ResourceHash {
    [index: string]: ResourceYamlData | undefined;
}

export type ResourceIndex = number;
export type ResourceName = string;

export interface ResourceYamlData {
    name: string,
    index: ResourceIndex,
    level: number,
    description: string
}
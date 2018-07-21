import { CheckUndefined } from "./check_func";

export function GenerateResourceYamlData(yamlData: Resource[]) {
    CheckUndefined(yamlData.length, "resourceのyamlが配列ではありません");
    let resourceHash: ResourceHash = {};
    yamlData.forEach(x => {
        CheckUndefined(x.name, "resourceのyamlにnameがありません");
        CheckUndefined(x.description, "resourceのyamlにdescriptionがありません");
        CheckUndefined(x.level, "resourceのyamlにlevelがありません");
        resourceHash[x.name] = x;
    });
    return resourceHash;
}

export interface ResourceHash {
    [index: string]: Resource;
}

export interface Resource {
    name: string,
    level: number,
    description: string
}
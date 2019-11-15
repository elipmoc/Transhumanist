import { GenerateResourceYamlData } from "../Client/Share/Yaml/resourceYamlData";
import { yamlGet } from "./yamlGet";
import { GenerateActionCardYamlData } from "../Client/Share/Yaml/actionCardYamlDataGen";

export const ResourceHash = GenerateResourceYamlData(yamlGet("./Client/Resource/Yaml/resource.yaml"));
export const ActionHash = GenerateActionCardYamlData(yamlGet("./Client/Resource/Yaml/actionCard.yaml"), false);

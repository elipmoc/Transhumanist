import { GenerateResourceYamlData } from "../Client/src/Share/Yaml/resourceYamlData";
import { yamlGet } from "./yamlGet";
import { GenerateActionCardYamlData } from "../Client/src/Share/Yaml/actionCardYamlDataGen";

export const ResourceHash = GenerateResourceYamlData(yamlGet("./Client/public/Resource/Yaml/resource.yaml"));
export const ActionHash = GenerateActionCardYamlData(yamlGet("./Client/public/Resource/Yaml/actionCard.yaml"), false);

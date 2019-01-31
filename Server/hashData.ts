import { GenerateResourceYamlData } from "../Share/Yaml/resourceYamlData";
import { yamlGet } from "./yamlGet";
import { GenerateActionCardYamlData } from "../Share/Yaml/actionCardYamlDataGen";

export const ResourceHash = GenerateResourceYamlData(yamlGet("./Resource/Yaml/resource.yaml"));
export const ActionHash = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), false);

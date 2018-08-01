import * as yaml from "js-yaml";
import * as fs from "fs";

export function yamlGet(fileName: string) {
    return yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
}
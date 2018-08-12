import * as $ from "jquery";
import { GenerateActionCardYamlData } from "../Share/Yaml/actionCardYamlDataGen";
import { ActionCardHash } from "../Share/Yaml/actionCardYamlData";
import { ResourceHash, GenerateResourceYamlData } from "../Share/Yaml/resourceYamlData";
import { EventHash, GenerateEventYamlData } from "../Share/Yaml/eventYamlData";

export interface Yamls {
    actionCardHash: ActionCardHash,
    buildActionCardHash: ActionCardHash,
    resourceHash: ResourceHash,
    eventHash: EventHash
}

export async function getYamls(): Promise<Yamls> {
    const actionCardHash = await new Promise<ActionCardHash>((resolve) =>
        $.get("/Json/actionCard.yaml", data => resolve(
            GenerateActionCardYamlData(JSON.parse(data), false)
        ))
    );
    const buildActionCardHash = await new Promise<ActionCardHash>((resolve) =>
        $.get("/Json/actionCard.yaml", data => resolve(
            GenerateActionCardYamlData(JSON.parse(data), true)
        ))
    );
    const resourceHash = await new Promise<ResourceHash>((resolve) =>
        $.get("/Json/resource.yaml", data => resolve(
            GenerateResourceYamlData(JSON.parse(data))
        ))
    );
    const eventHash = await new Promise<EventHash>((resolve) =>
        $.get("/Json/event.yaml", data => resolve(
            GenerateEventYamlData(JSON.parse(data))
        ))
    );
    return {
        actionCardHash,
        buildActionCardHash,
        resourceHash,
        eventHash
    }
}
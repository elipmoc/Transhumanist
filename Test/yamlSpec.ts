import { GenerateResourceYamlData } from "../Share/Yaml/resourceYamlData";
import { GenerateEventYamlData } from "../Share/Yaml/eventYamlData";
import { GenerateActionCardYamlData } from "../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../Server/yamlGet";

describe("GenerateResourceYamlData", () => {
    it("", () => {
        const data = yamlGet("./Resource/Yaml/resource.yaml");
        const resourceHash = GenerateResourceYamlData(data);
        expect(resourceHash["人間"]!.name).toBeDefined();
        expect(resourceHash["人間"]!.level).toBeDefined();
        expect(resourceHash["人間"]!.description).toBeDefined();
        expect(resourceHash["人間"]!.index).toEqual(0);
    });
});

describe("GenerateEventYamlData", () => {
    it("", () => {
        const data = yamlGet("./Resource/Yaml/event.yaml");
        const eventHash = GenerateEventYamlData(data);
        expect(eventHash["無風状態"]!.name).toBeDefined();
        expect(eventHash["無風状態"]!.level).toBeDefined();
        expect(eventHash["無風状態"]!.description).toBeDefined();
        expect(eventHash["無風状態"]!.forever).toBeDefined();
        expect(eventHash["無風状態"]!.index).toEqual(0);
    });
});

describe("ActionCardYamlDataCheck", () => {
    it("", () => {
        const data = yamlGet("./Resource/Yaml/actionCard.yaml");
        const actionCardHash = GenerateActionCardYamlData(data, false);
        expect(actionCardHash["採掘施設"]!.name).toBeDefined();
        expect(actionCardHash["採掘施設"]!.level).toBeDefined();
        expect(actionCardHash["採掘施設"]!.build_use).toBeDefined();
        expect(actionCardHash["採掘施設"]!.description).toBeDefined();
        expect(actionCardHash["採掘施設"]!.cost).toBeDefined();
        expect(actionCardHash["採掘施設"]!.commands).toBeDefined();
        expect(actionCardHash["採掘施設"]!.commands[0].kind).toBeDefined();
        expect(actionCardHash["採掘施設"]!.index).toEqual(0);
    });
});
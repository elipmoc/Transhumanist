import { SocketBinder } from "../socketBinder";
import { ResourceName, GenerateResourceYamlDataArray } from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";

export class ResourceList {
    private resourceList: SocketBinder.BinderList<ResourceName | null>;

    constructor(boardSocketManager: Namespace, playerId: number) {
        this.resourceList = new SocketBinder.BinderList<ResourceName | null>("ResourceKindList" + playerId)
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        boardSocketManager.addSocketBinder(this.resourceList);
    }

    public addResource(name: ResourceName) {
        const idx = this.resourceList.Value.findIndex(x => x == null);
        this.resourceList.setAt(idx, name);
    }

    setResourceList() {
        this.resourceList.Value.fill("人間", 0, 4);
        const arr = GenerateResourceYamlDataArray(yamlGet("./Resource/Yaml/resource.yaml")).filter((x) =>
            x.level == 2);
        this.resourceList.setAt(4, arr[Math.floor(Math.random() * arr.length)].name);
        this.resourceList.update();
    }
}
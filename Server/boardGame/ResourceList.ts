import { SocketBinder } from "../socketBinder";
import { ResourceName, GenerateResourceYamlDataArray } from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";

export class ResourceList {
    private resourceList: SocketBinder.BinderList<ResourceName | null>;
    private resourceOver: SocketBinder.Binder<number | null>;
    private throwResource: SocketBinder.EmitReceiveBinder<number[]>;

    constructor(boardSocketManager: Namespace, playerId: number) {
        this.resourceList = new SocketBinder.BinderList<ResourceName | null>("ResourceKindList" + playerId)
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        this.resourceOver = new SocketBinder.Binder<number | null>("ResourceOver", true, ["player" + playerId]);
        this.resourceOver.Value = null;
        this.throwResource = new SocketBinder.EmitReceiveBinder("ThrowResource", true, ["player" + playerId])
        this.throwResource.OnReceive(throwResourceIdList => {
            console.log(`throwResource:${throwResourceIdList}`);
            this.resourceOver.Value = null;
        });
        boardSocketManager.addSocketBinder(this.resourceList, this.resourceOver, this.throwResource);
    }

    public addResource(name: ResourceName) {
        const idx = this.resourceList.Value.findIndex(x => x == null);
        if (idx == -1) {
            this.resourceOver.Value = 1;
        } else {
            this.resourceList.setAt(idx, name);
        }
    }

    setResourceList() {
        //        this.resourceList.Value.fill("人間", 0, 4);
        this.resourceList.Value.fill("人間", 0, 30);
        const arr = GenerateResourceYamlDataArray(yamlGet("./Resource/Yaml/resource.yaml")).filter((x) =>
            x.level == 2);
        this.resourceList.setAt(4, arr[Math.floor(Math.random() * arr.length)].name);
        this.resourceList.update();
    }
}
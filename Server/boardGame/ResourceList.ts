import { SocketBinder } from "../socketBinder";
import { ResourceName, GenerateResourceYamlDataArray } from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";
import { ThrowResource } from "../../Share/throwResource";

export class ResourceList {
    private resourceList: SocketBinder.BinderList<ResourceName | null>;
    private resourceReserveList: SocketBinder.BinderList<ResourceName | null>;
    private resourceOver: SocketBinder.Binder<number>;
    private throwResource: SocketBinder.EmitReceiveBinder<ThrowResource>;

    clear() {
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        this.resourceReserveList.Value = new Array(12);
        this.resourceReserveList.Value.fill(null);
        this.resourceOver.Value = 0;
    }

    constructor(boardSocketManager: Namespace, playerId: number) {
        this.resourceList = new SocketBinder.BinderList<ResourceName | null>("ResourceKindList" + playerId)
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        this.resourceReserveList = new SocketBinder.BinderList<ResourceName | null>("ResourceReserveKindList", true, ["player" + playerId]);
        this.resourceReserveList.Value = new Array(12);
        this.resourceReserveList.Value.fill(null);
        this.resourceOver = new SocketBinder.Binder<number>("ResourceOver", true, ["player" + playerId]);
        this.resourceOver.Value = 0;
        this.throwResource = new SocketBinder.EmitReceiveBinder("ThrowResource", true, ["player" + playerId])
        this.throwResource.OnReceive(throwResource => {
            console.log(`throwResource: ${throwResource.resourceList},,${throwResource.resourceReserveList}`);
            if (this.resourceOver.Value == throwResource.resourceList.length + throwResource.resourceReserveList.length) {
                this.resourceOver.Value = 0;
                throwResource.resourceList.forEach(id => {
                    this.resourceList.Value[id] = null;
                })
                throwResource.resourceReserveList.forEach(id => {
                    this.resourceReserveList.Value[id] = null;
                })
                this.resourceReserveList.Value.forEach(name => {
                    if (name)
                        this.addResource(name);
                });
                this.resourceReserveList.Value.fill(null);
                this.resourceReserveList.update();
                this.resourceList.update();

            }
        });
        boardSocketManager.addSocketBinder(this.resourceList, this.resourceOver, this.throwResource, this.resourceReserveList);
    }

    public addResource(name: ResourceName) {
        let idx = this.resourceList.Value.findIndex(x => x == null);
        if (idx == -1) {
            this.resourceOver.Value = this.resourceOver.Value + 1;
            idx = this.resourceReserveList.Value.findIndex(x => x == null);
            this.resourceReserveList.setAt(idx, name);
        } else {
            this.resourceList.setAt(idx, name);
        }
    }

    setResourceList() {
        this.resourceList.Value.fill("人間", 0, 4);
        const arr = GenerateResourceYamlDataArray(yamlGet("./Resource/Yaml/resource.yaml")).filter((x) =>
            x.level == 2);
        this.resourceList.setAt(4, arr[Math.floor(Math.random() * arr.length)].name);
        this.resourceList.update();
    }
}
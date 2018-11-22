import { SocketBinder } from "../socketBinder";
import { ResourceName, GenerateResourceYamlDataArray } from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";
import { ThrowResource } from "../../Share/throwResource";
import { ResourceItem } from "../../Share/Yaml/actionCardYamlData";

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

    //リソースを任意個数追加
    public addResource(name: ResourceName, num: number = 1) {
        for (let i = 0; i < num; i++) {
            let idx = this.resourceList.Value.findIndex(x => x == null);
            if (idx == -1) {
                this.resourceOver.Value = this.resourceOver.Value + 1;
                idx = this.resourceReserveList.Value.findIndex(x => x == null);
                this.resourceReserveList.setAt(idx, name);
            } else
                this.resourceList.setAt(idx, name);
        }
    }

    //リソースを任意個数削除
    public deleteResource(name: ResourceName, num: number) {
        //ちなみに無くてもスルーします。
        let arr = this.resourceList.Value;
        let count = 0;
        arr = arr.map(x => {
            if (count > num) return x;
            if (name != x) return x;

            count++;
            return null;
        });
        this.resourceList.Value = arr;
    }

    //randomに消す
    public randomDeleteResource(num: number) {
        let arr = this.resourceList.Value;
        let allCount = this.getAllCount();

        //乱数で消す数以上リソースがある
        if (allCount >= num) {
            let target: number[];
            target = new Array(num);
            target.fill(-1);

            for (let i = 0; i > target.length; i++) {
                let ranNum = Math.floor(Math.random() * allCount);
                while (!target.includes(ranNum)) {
                    ranNum = Math.floor(Math.random() * allCount);
                }
                target[i] = ranNum;
            }

            arr = arr.map((x, index) => {
                if (target.includes(index)) return null;
                return x;
            });
        }
        //消す数より少なかった
        else {
            arr.fill(null);
        }
        this.resourceList.Value = arr;
    }

    //リソースを任意個数交換
    public changeResource(targetName: ResourceName,changeName :ResourceName, num: number) {
        //ちなみに無くてもスルーします。
        let arr = this.resourceList.Value;
        let count = 0;
        arr = arr.map(x => {
            if (count > num) return x;
            if (targetName != x) return x;

            count++;
            return changeName;
        });
        this.resourceList.Value = arr;
    }

    setResourceList() {
        this.resourceList.Value.fill("人間", 0, 4);
        const arr = GenerateResourceYamlDataArray(yamlGet("./Resource/Yaml/resource.yaml")).filter((x) =>
            x.level == 2);
        this.resourceList.setAt(4, arr[Math.floor(Math.random() * arr.length)].name);
        this.resourceList.update();
    }

    //指定したリソースがいくつあるかを計算する
    getCount(name: ResourceName) {
        return this.resourceList.Value.filter(x => x == name).length;
    }

    //null以外の数
    getAllCount(){
        let count = 0;
        this.resourceList.Value.forEach(x => {
            if (x != null) count++;
        });
        return count;
    }

    //カードのコストを支払う。
    //払えなければ、falseを返す
    costPayment(cost: ResourceItem[]) {
        if (cost.filter(x => this.getCount(x.name) < x.number).length != 0)
            return false;
        let arr = this.resourceList.Value;
        cost.forEach(x => {
            let count = 0;
            arr = arr.map(y => {
                if (x.name == y) count++;
                if (y != x.name || count > x.number) return y;
                return null;
            })
        });
        this.resourceList.Value = arr;
        return true;
    }
}
import { SocketBinder } from "../socketBinder";
import {
    ResourceName,
    GenerateResourceYamlDataArray
} from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";
import { ThrowResource } from "../../Share/throwResource";
import { ResourceOver } from "../../Share/elementOver";
import { arrayshuffle } from "../../Share/utility";
import { ResourceItem } from "../../Share/Yaml/actionCardYamlData";
import { HaveResourceCard } from "../../Share/haveResourceCard";

export class ResourceList {
    private resourceList: SocketBinder.BinderList<HaveResourceCard | null>;
    private resourceReserveList: SocketBinder.BinderList<ResourceName | null>;
    private resourceOver: SocketBinder.Binder<ResourceOver>;
    private throwResource: SocketBinder.EmitReceiveBinder<ThrowResource>;
    private haveFusionReactor: boolean;
    
    //頑張ってリファクタリングして
    private nowEvent = false;
    setNowEvent(flag: boolean) {
        this.nowEvent = flag;
    }
    private eventClearCallback: () => void;
    onEventClearCallback(f: () => void) {
        this.eventClearCallback = f;
    }

    clear() {
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        this.resourceReserveList.Value = new Array(12);
        this.resourceReserveList.Value.fill(null);
        this.resourceOver.Value.overCount = 0;
    }

    constructor(boardSocketManager: Namespace, playerId: number) {
        this.resourceList = new SocketBinder.BinderList<HaveResourceCard | null>(
            "ResourceKindList" + playerId
        );
        this.resourceList.Value = new Array(30);
        this.resourceList.Value.fill(null);
        this.resourceReserveList = new SocketBinder.BinderList<ResourceName | null>(
            "ResourceReserveKindList",
            true,
            ["player" + playerId]
        );
        this.resourceReserveList.Value = new Array(12);
        this.resourceReserveList.Value.fill(null);
        this.resourceOver = new SocketBinder.Binder<ResourceOver>(
            "ResourceOver",
            true,
            ["player" + playerId]
        );
        this.resourceOver.Value = { overCount: 0, causeText: "" };
        this.throwResource = new SocketBinder.EmitReceiveBinder(
            "ThrowResource",
            true,
            ["player" + playerId]
        );
        this.throwResource.OnReceive(throwResource => {
            if (
                this.resourceOver.Value.overCount ==
                throwResource.resourceList.length +
                throwResource.resourceReserveList.length
            ) {
                this.resourceOver.Value = { overCount: 0, causeText: "" };
                throwResource.resourceList.forEach(id => {
                    this.resourceList.Value[id] = null;
                });
                throwResource.resourceReserveList.forEach(id => {
                    this.resourceReserveList.Value[id] = null;
                });
                this.resourceReserveList.Value.forEach(name => {
                    if (name) this.addResource(name);
                });
                this.resourceReserveList.Value.fill(null);
                this.resourceReserveList.update();
                this.setCrowdList(this.resourceList.Value);

                if (this.nowEvent) {
                    this.eventClearCallback();
                }
            }
        });
        boardSocketManager.addSocketBinder(
            this.resourceList,
            this.resourceOver,
            this.throwResource,
            this.resourceReserveList
        );
    }

    //リソースを任意個数追加
    public addResource(name: ResourceName, num: number = 1) {
        const arr = this.resourceList.Value;
        for (let i = 0; i < num; i++) {
            let idx = arr.findIndex(x => x == null);
            if (idx == -1) {
                const emitValue: ResourceOver = {
                    overCount: this.resourceOver.Value.overCount + 1,
                    causeText: "リソースがいっぱいです。"
                };
                this.resourceOver.Value = emitValue;

                idx = this.resourceReserveList.Value.findIndex(x => x == null);
                this.resourceReserveList.setAt(idx, name);
            } else arr[idx] = { resourceCardName: name, guardFlag: false };
        }
        this.setCrowdList(arr);
    }

    //リソースを任意個数削除
    public deleteResource(name: ResourceName, num: number) {
        //ちなみに無くてもスルーします。
        let arr = this.resourceList.Value;
        let count = 0;
        arr = arr.map(x => {
            if (x == null) return x;
            if (count >= num) return x;
            if (name != x.resourceCardName) return x;
            count++;
            return null;
        });
        this.setCrowdList(arr);
    }

    //randomに消す
    public randomDeleteResource(num: number) {
        let arr = this.resourceList.Value;
        const allCount = this.getAllCount();

        //乱数で消す数以上リソースがある
        if (allCount >= num) {
            let targetIndexes = new Array<number>(allCount)
                .fill(0)
                .map((_, idx) => idx);
            targetIndexes = arrayshuffle(targetIndexes).slice(0, num);
            arr = arr.map((x, index) =>
                targetIndexes.includes(index) ? null : x
            );
        }
        //消す数より少なかった
        else arr.fill(null);
        this.setCrowdList(arr);
    }

    //リソースを任意個数交換
    public changeResource(
        targetName: ResourceName,
        changeName: ResourceName,
        num: number
    ) {
        //ちなみに無くてもスルーします。
        let arr = this.resourceList.Value;
        let count = 0;
        arr = arr.map(x => {
            if (x == null) return x;
            if (count >= num) return x;
            if (targetName != x.resourceCardName) return x;
            count++;
            return { resourceCardName: changeName, guardFlag: false };
        });
        this.setCrowdList(arr);
    }

    deleteRequest(num: number, text: string) {
        const emitValue: ResourceOver = {
            overCount: num,
            causeText: text
        };
        this.resourceOver.Value = emitValue;
    }

    setResourceList() {
        for (let i = 0; i < 4; i++)
            this.resourceList.Value[i] = { resourceCardName: "人間", guardFlag: false };
        const arr = GenerateResourceYamlDataArray(
            yamlGet("./Resource/Yaml/resource.yaml")
        ).filter(x => x.level == 2);
        this.resourceList.Value[4] =
            { resourceCardName: arr[Math.floor(Math.random() * arr.length)].name, guardFlag: false };
        this.resourceList.update();
    }

    //指定したリソースがいくつあるかを計算する
    getCount(name: ResourceName) {
        return this.resourceList.Value.filter(x => x != null && x.resourceCardName == name).length;
    }

    //null以外の数
    getAllCount() {
        let count = 0;
        this.resourceList.Value.forEach(x => {
            if (x != null) count++;
        });
        return count;
    }

    //指定インデックスのリソースをguardする
    setGuard(index: number) {
        const val = this.resourceList.Value[index];
        if (val == null) return;
        val.guardFlag = true;
        this.resourceList.setAt(index, val);
    }

    //破壊対象からの防御をリセットする
    resetGuard() {
        this.resourceList.Value.map(x => {
            if (x != null)
                x.guardFlag = false;
            return x;
        })
        this.resourceList.update();
    }

    setCrowdList(arr: (HaveResourceCard | null)[]) {
        arr.sort((a, b) => {
            if (a == b) return 0;
            if (b == null) return -1;
            if (a == null) return 1;
            return a.resourceCardName > b.resourceCardName ? 1 : -1;
        });
        this.resourceList.Value = arr;
    }

    setHaveFusionReactor(have: boolean) {
        this.haveFusionReactor = have;
    }
    
    //カードのコストを支払えるかどうかの判定をする。
    //払えなければ、falseを返す
    canCostPayment(cost: ResourceItem[]) {
        const NonEnough = cost.filter(x => this.getCount(x.name) < x.number);
        if (NonEnough.length == 0) return true;

        //核融合炉用
        if (this.haveFusionReactor) {
            return (NonEnough.filter(x => x.name == "ガス").length == NonEnough.length);
        }
        return false;
    }

    //カードのコストを支払う。
    costPayment(cost: ResourceItem[]) {
        if (this.canCostPayment(cost) == false) return;
        let arr = this.resourceList.Value;
        cost.forEach(x => {
            let count = 0;
            arr = arr.map(y => {
                if (y == null) return null;
                if (x.name == y.resourceCardName) count++;
                if (y.resourceCardName != x.name || count > x.number) return y;
                return null;
            });
        });
        this.setCrowdList(arr);
    }
}

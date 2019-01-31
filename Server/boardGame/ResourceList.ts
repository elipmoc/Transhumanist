import { SocketBinder } from "../socketBinder";
import {
    ResourceName,
    GenerateResourceYamlDataArray,
} from "../../Share/Yaml/resourceYamlData";
import { yamlGet } from "../yamlGet";
import { Namespace } from "../socketBinder/bindManager";
import { ThrowResource } from "../../Share/throwResource";
import { ResourceOver } from "../../Share/elementOver";
import { arrayshuffle } from "../../Share/utility";
import { ResourceItem } from "../../Share/Yaml/actionCardYamlData";
import { HaveResourceCard } from "../../Share/haveResourceCard";
import { ResourceHash } from "../hashData";


export class ResourceList {
    private resourceList: SocketBinder.BinderList<HaveResourceCard | null>;
    private resourceReserveList: SocketBinder.BinderList<ResourceName | null>;
    private resourceOver: SocketBinder.Binder<ResourceOver>;
    private throwResource: SocketBinder.EmitReceiveBinder<ThrowResource>;
    private haveFusionReactor: boolean;
    private resourceCapacity: number;

    //リソースオーバー中かどうか
    get OverResourceFlag() {
        return this.resourceOver.Value.overCount != 0;
    }

    setResourceCapacity(val: number) {
        this.resourceCapacity = val;
        const delta = this.getAllCount() - this.resourceCapacity;
        if (delta > 0) {
            const emitValue: ResourceOver = {
                overCount: delta,
                causeText: "リソースがいっぱいです。"
            };
            this.resourceOver.Value = emitValue;
        }
    }



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
            if (idx == -1 || this.getAllCount() >= this.resourceCapacity) {
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
            if (x == null || x.guardFlag) return x;
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
        //まず、nullじゃないかつ、リソースが保護されていないリソースの要素番号を抽出
        const existIndexList: number[] =
            arr.map((x, i) => {
                if (x == null || x.guardFlag)
                    return null;
                return i;
            }).filter(x => x != null) as number[];
        const count = existIndexList.length;

        //乱数で消す数以上リソースがある
        if (count >= num) {
            arrayshuffle(existIndexList).slice(0, num)
                .forEach(index => arr[index] = null)
        }
        //消す数より少なかった
        else
            existIndexList.forEach(index => arr[index] = null);
        this.setCrowdList(arr);
    }

    //リソースを任意個数交換
    public changeResource(
        targetNames: ResourceName[],
        changeName: ResourceName,
        num: number
    ) {
        //ちなみに無くてもスルーします。
        let arr = this.resourceList.Value;
        let count = 0;
        arr = arrayshuffle(arr).map(x => {
            if (
                x == null ||
                count >= num ||
                targetNames.includes(x.resourceCardName) == false ||
                x.guardFlag == true
            ) return x;
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

    //指定したレベルのリソースが存在するかの判定
    getExistLevel(level: number) {
        return this.resourceList.Value
            .some(x => x != null && ResourceHash[x.resourceCardName] != undefined && ResourceHash[x.resourceCardName]!.level == level);
    }

    //指定したリソースがいくつあるかを計算する
    getCount(name: ResourceName) {
        return this.resourceList.Value.filter(x => x != null && x.resourceCardName == name).length;
    }

    //null以外のリソースの数
    getAllCount() {
        return this.resourceList.Value.filter(x =>
            x != null
        ).length;
    }

    //null以外かつ保護されていないリソースの数
    getAllNonGuardCount() {
        return this.resourceList.Value.filter(x =>
            x != null && x.guardFlag == false
        ).length;
    }

    getResourceName(index: number) {
        const getData = this.resourceList.Value[index];
        return getData == null ? null : getData.resourceCardName;
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
                if (y == null || y.guardFlag == true || y.resourceCardName != x.name || count >= x.number) return y;
                count++;
                return null;
            });
            arr = arr.map(y => {
                if (y == null || y.resourceCardName != x.name || count >= x.number) return y;
                count++;
                return null;
            });

        });
        this.setCrowdList(arr);
    }
}

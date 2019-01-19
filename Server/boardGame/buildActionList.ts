import { SocketBinder } from "../socketBinder";
import {
    ActionCardName,
    ActionCardYamlData
} from "../../Share/Yaml/actionCardYamlData";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";
import { BuildOver } from "../../Share/elementOver";
import { arrayshuffle } from "../../Share/utility";
import { ThrowBuildAction } from "../../Share/throwBuildAction";
import { HaveBuildActionCard } from "../../Share/haveBuildActionCard";

type UseSuccessFlag = boolean;

const buildActionCardHash = GenerateActionCardYamlData(
    yamlGet("./Resource/Yaml/actionCard.yaml"),
    true
)

export class BuildActionList {
    private buildActionList: SocketBinder.BinderList<HaveBuildActionCard | null>;
    private useBuildActionCardCallback: (card: ActionCardYamlData, data: SelectBuildActionData) => UseSuccessFlag;
    private deleteBuildActionCardCallback: (card: ActionCardYamlData) => void;
    private buildReserveList: SocketBinder.BinderList<ActionCardName | null>;
    private buildOver: SocketBinder.Binder<BuildOver>;
    private throwBuild: SocketBinder.EmitReceiveBinder<ThrowBuildAction>;

    private buildCapacity: number;

    get OverBuildFlag() {
        return this.buildOver.Value.overCount != 0;
    }

    setBuildCapacity(val: number) {
        this.buildCapacity = val;
        const delta = this.getAllCount() - this.buildCapacity;
        if (delta > 0) {
            const emitValue: BuildOver = {
                overCount: delta,
                causeText: "設置したアクションカードがいっぱいです。"
            };
            this.buildOver.Value = emitValue;
        }
    }

    //頑張ってリファクタリングして
    private nowEvent = false;
    setNowEvent(flag: boolean) {
        this.nowEvent = flag;
    }
    private eventClearCallback: () => void;
    onEventClearCallback(f: () => void) {
        this.eventClearCallback = f;
    }

    constructor(boardSocketManager: SocketBinder.Namespace, playerId: number) {
        this.buildActionList = new SocketBinder.BinderList<HaveBuildActionCard>(
            "BuildActionKindList" + playerId
        );
        this.buildReserveList = new SocketBinder.BinderList<ActionCardName | null>(
            "BuildReserveKindList",
            true,
            ["player" + playerId]
        );
        this.buildReserveList.Value = new Array(12);
        this.buildReserveList.Value.fill(null);
        const selectBuildAction = new SocketBinder.EmitReceiveBinder<
            SelectBuildActionData
            >("SelectBuildAction", true, [`player${playerId}`]);
        selectBuildAction.OnReceive(x => {
            const data = x;
            const card = this.buildActionList.Value[x.iconId];
            if (card == null || card.usedFlag == true) return;

            const useBuildActionCard = buildActionCardHash[card.actionCardName];

            if (useBuildActionCard && this.useBuildActionCardCallback(useBuildActionCard, data)) {
                card.usedFlag = true;
                this.buildActionList.setAt(x.iconId, card)
            }
        });
        this.buildOver = new SocketBinder.Binder<BuildOver>("BuildOver", true, [
            "player" + playerId
        ]);
        this.buildOver.Value = { overCount: 0, causeText: "" };
        this.throwBuild = new SocketBinder.EmitReceiveBinder(
            "ThrowBuild",
            true,
            ["player" + playerId]
        );
        this.throwBuild.OnReceive(throwBuild => {
            if (
                this.buildOver.Value.overCount ==
                throwBuild.buildActionList.length +
                throwBuild.buildReserveList.length
            ) {
                this.buildOver.Value = { overCount: 0, causeText: "" };
                throwBuild.buildActionList.forEach(id => {
                    this.deleteBuildActionCardCallback(
                        buildActionCardHash[this.buildActionList.Value[id]!.actionCardName]!
                    );
                    this.buildActionList.Value[id] = null;
                });
                throwBuild.buildReserveList.forEach(id => {
                    this.deleteBuildActionCardCallback(
                        buildActionCardHash[this.buildReserveList.Value[id]!]!
                    );
                    this.buildReserveList.Value[id] = null;
                });
                this.buildReserveList.Value.slice().forEach(name => {
                    if (name) this.addBuildAction(name);
                });
                this.buildReserveList.Value.fill(null);
                this.buildReserveList.update();
                this.setCrowdList(this.buildActionList.Value);

                if (this.nowEvent) this.eventClearCallback();
            }
        });
        this.clear();

        boardSocketManager.addSocketBinder(
            this.buildActionList,
            selectBuildAction,
            this.buildOver,
            this.buildReserveList,
            this.throwBuild
        );
    }
    clear() {
        this.buildActionList.Value = new Array(30).fill(null);
        this.buildReserveList.Value = new Array(12);
        this.buildReserveList.Value.fill(null);
    }

    //指定した設置アクションカードがいくつあるかを計算する
    getCount(name: ActionCardName) {
        return this.buildActionList.Value.filter(x => x != null && x.actionCardName == name).length;
    }

    //null以外の数
    getAllCount() {
        let count = 0;
        this.buildActionList.Value.forEach(x => {
            if (x != null) count++;
        });
        return count;
    }

    resetUsed() {
        this.buildActionList.Value.map(x => {
            if (x != null)
                x.usedFlag = false;
            return x;
        })
        this.buildActionList.update();
    }

    addBuildAction(name: ActionCardName) {
        const idx = this.buildActionList.Value.findIndex(x => x == null);
        if (idx == -1 || this.getAllCount() >= this.buildCapacity) {
            const emitValue: BuildOver = {
                overCount: this.buildOver.Value.overCount + 1,
                causeText: "設置したアクションカードがいっぱいです。"
            };
            this.buildOver.Value = emitValue;
            const reserveIdx = this.buildReserveList.Value.findIndex(x => x == null);
            this.buildReserveList.setAt(reserveIdx, name);
        }
        else
            this.buildActionList.setAt(idx, { actionCardName: name, usedFlag: false });
        this.setCrowdList(this.buildActionList.Value);
    }

    deleteBuildAction(name: ActionCardName, num: number) {
        let arr = this.buildActionList.Value.slice();
        let count = 0;

        arr = arr.map(x => {
            if (count > num) return x;
            if (x == null || x.actionCardName != name) return x;

            count++;
            return null;
        });

        this.consume(this.buildActionList.Value, arr);
        this.setCrowdList(arr);
    }

    //randomに消す
    randomDeleteBuildAction(num: number) {
        let arr = this.buildActionList.Value.slice();
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
        this.consume(this.buildActionList.Value, arr);
        this.setCrowdList(arr);
    }

    deleteRequest(num: number, text: string) {
        const emitValue: BuildOver = {
            overCount: num,
            causeText: text
        };
        this.buildOver.Value = emitValue;
    }

    setCrowdList(arr: (HaveBuildActionCard | null)[]) {
        arr.sort((a, b) => {
            if (a == b) return 0;
            if (b == null) return -1;
            if (a == null) return 1;
            return a.actionCardName > b.actionCardName ? 1 : -1;
        });
        this.buildActionList.Value = arr;
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseBuildActionCard(f: (card: ActionCardYamlData, data: SelectBuildActionData) => UseSuccessFlag) {
        this.useBuildActionCardCallback = f;
    }

    //カードが削除される時に呼ばれる関数をセット
    onDeleteBuildActionCard(f: (card: ActionCardYamlData) => void) {
        this.deleteBuildActionCardCallback = f;
    }

    private consume(before: (HaveBuildActionCard | null)[], after: (HaveBuildActionCard | null)[]) {
        before.map((x, idx) => {
            if (x != null && after[idx] == null)
                this.deleteBuildActionCardCallback(buildActionCardHash[x.actionCardName]!)
        });
    }
}

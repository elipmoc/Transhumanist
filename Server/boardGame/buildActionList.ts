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

export class BuildActionList {
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;
    private useBuildActionCardCallback: (card: ActionCardYamlData,data: SelectBuildActionData) => void;
    private buildOver: SocketBinder.Binder<BuildOver>;
    private throwBuild: SocketBinder.EmitReceiveBinder<ThrowBuildAction>;

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
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>(
            "BuildActionKindList" + playerId
        );
        const selectBuildAction = new SocketBinder.EmitReceiveBinder<
            SelectBuildActionData
            >("SelectBuildAction", true, [`player${playerId}`]);
        selectBuildAction.OnReceive(x => {
            const data = x;
            const cardName = this.buildActionList.Value[x.iconId];

            const useBuildActionCard = GenerateActionCardYamlData(
                yamlGet("./Resource/Yaml/actionCard.yaml"),
                true
            )[cardName!];
            if (useBuildActionCard) {
                this.useBuildActionCardCallback(useBuildActionCard,data);
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
            console.log(`throwBuild: ${throwBuild}`);
            if (
                this.buildOver.Value.overCount ==
                throwBuild.buildActionList.length
            ) {
                this.buildOver.Value = { overCount: 0, causeText: "" };
                throwBuild.buildActionList.forEach(id => {
                    this.buildActionList.Value[id] = null;
                });
                this.setCrowdList(this.buildActionList.Value);

                if (this.nowEvent) this.eventClearCallback();
            }
        });

        boardSocketManager.addSocketBinder(
            this.buildActionList,
            selectBuildAction,
            this.buildOver,
            this.throwBuild
        );
        this.clear();
    }
    clear() {
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
    }

    //指定した設置アクションカードがいくつあるかを計算する
    getCount(name: ActionCardName) {
        return this.buildActionList.Value.filter(x => x == name).length;
    }

    //null以外の数
    getAllCount() {
        let count = 0;
        this.buildActionList.Value.forEach(x => {
            if (x != null) count++;
        });
        return count;
    }

    addBuildAction(name: ActionCardName) {
        const idx = this.buildActionList.Value.findIndex(x => x == null);
        if (idx != -1) this.buildActionList.setAt(idx, name);
        this.setCrowdList(this.buildActionList.Value);
    }

    deleteBuildAction(name: ActionCardName, num: number) {
        let arr = this.buildActionList.Value;
        let count = 0;

        arr = arr.map(x => {
            if (count > num) return x;
            if (x != name) return x;

            count++;
            return null;
        });

        this.setCrowdList(arr);
    }

    //randomに消す
    public randomDeleteBuildAction(num: number) {
        let arr = this.buildActionList.Value;
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

    deleteRequest(num: number, text: string) {
        const emitValue: BuildOver = {
            overCount: num,
            causeText: text
        };
        this.buildOver.Value = emitValue;
    }

    setCrowdList(arr: (ActionCardName | null)[]) {
        arr.sort((a, b) => {
            if (a == b) return 0;
            if (b == null) return -1;
            if (a == null) return 1;
            return a > b ? 1 : -1;
        });
        this.buildActionList.Value = arr;
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseBuildActionCard(f: (card: ActionCardYamlData,data:SelectBuildActionData) => void) {
        this.useBuildActionCardCallback = f;
    }
}

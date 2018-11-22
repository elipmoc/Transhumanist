import { SocketBinder } from "../socketBinder";
import { ActionCardName, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { GenerateActionCardYamlData } from "../../Share/Yaml/actionCardYamlDataGen";
import { yamlGet } from "../yamlGet";

export class BuildActionList {
    private buildActionList: SocketBinder.BinderList<ActionCardName | null>;
    private useBuildActionCardCallback: (card: ActionCardYamlData) => void;

    constructor(boardSocketManager: SocketBinder.Namespace, playerId: number) {
        this.buildActionList = new SocketBinder.BinderList<ActionCardName>("BuildActionKindList" + playerId);
        const selectBuildAction =
            new SocketBinder.EmitReceiveBinder<SelectBuildActionData>("SelectBuildAction", true, [`player${playerId}`]);
        selectBuildAction.OnReceive(x => {
            const cardName = this.buildActionList.Value[x.iconId];

            const useBuildActionCard =
                GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), true)[cardName!];
            if (useBuildActionCard) {
                this.useBuildActionCardCallback(useBuildActionCard)
            }
        })
        boardSocketManager.addSocketBinder(this.buildActionList, selectBuildAction);
        this.clear();
    }
    clear() {
        this.buildActionList.Value = new Array(30);
        this.buildActionList.Value.fill(null);
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
        if (idx != -1)
            this.buildActionList.setAt(idx, name);
    }

    deleteBuildAction(name: ActionCardName,num:number) {
        let arr = this.buildActionList.Value;
        let count = 0;
        
        arr = arr.map(x => {
            if (count > num) return x;
            if (x != name) return x;

            count++;
            return null;
        });

        this.buildActionList.Value = arr;
        this.crowdList();
    }

    //randomに消す
    public randomDeleteResource(num: number) {
        let arr = this.buildActionList.Value;
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
        this.buildActionList.Value = arr;
        this.crowdList();
    }

    crowdList() {
        let nullCount = 0;
        let arr = this.buildActionList.Value;
        arr.fill(null);

        this.buildActionList.Value.forEach((x, index) => {
            if (x != null) arr[index - nullCount] = x;
            else nullCount++;
        });

        this.buildActionList.Value = arr;
    }

    //カードが使用されるときに呼ばれる関数をセット
    onUseBuildActionCard(f: (card: ActionCardYamlData) => void) {
        this.useBuildActionCardCallback = f;
    }
}
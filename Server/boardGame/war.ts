import { SocketBinder } from "../socketBinder";

export class War {

    private declareWar: SocketBinder.EmitReceiveBinder<(number | null)[]>;
    private warPairList: SocketBinder.BinderList<{ playerId1: number, playerId2: number }>;
    constructor(boardSocketManager: SocketBinder.Namespace) {
        this.declareWar = new SocketBinder.EmitReceiveBinder<number[]>("declareWar");
        this.declareWar.OnReceive(x => {
            if (
                x.length == 2 &&
                x[0] != null &&
                x[1] != null &&
                x[0] != x[1]
            ) {
                console.log(`declareWar player_id[${x[0]},${x[1]}]`);
                const same = this.warPairList.Value.find(y =>
                    y.playerId1 == x[0] || y.playerId2 == x[0] || y.playerId1 == x[1] || y.playerId2 == x[1]
                );
                if (same == undefined) {
                    this.warPairList.push({ playerId1: x[0]!, playerId2: x[1]! });
                }
            }
        });
        this.warPairList = new SocketBinder.BinderList<{ playerId1: number, playerId2: number }>("warPairList");
        this.warPairList.Value = [];
        boardSocketManager.addSocketBinder(this.declareWar, this.warPairList);
    }
}
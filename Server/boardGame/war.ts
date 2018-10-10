import { SocketBinder } from "../socketBinder";

export class War {
    private declareWar: SocketBinder.EmitReceiveBinder<(number | null)[]>;
    private warPair: SocketBinder.BinderList<number[]>;
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
                const same = this.warPair.Value.find(y =>
                    y[0] == x[0] || y[1] == x[0] || y[0] == x[1] || y[1] == x[1]
                );
                if (same == undefined) {
                    this.warPair.push(<number[]>x);
                }
            }
        });
        this.warPair = new SocketBinder.BinderList<number[]>("warPair");
        this.warPair.Value = [];
        boardSocketManager.addSocketBinder(this.declareWar, this.warPair);
    }
}
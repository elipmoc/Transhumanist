import { SocketBinder } from "../socketBinder";

export type WarSuccessFlag = boolean;

export class War {
    private surrenderCallback: () => WarSuccessFlag;
    private startWarCallback: (targetPlayerId: number) => WarSuccessFlag;
    private warFlag = false;

    getWarFlag() { return this.warFlag; }

    startWar() {
        this.warFlag = true;
    }

    reset() {
        this.warFlag = false;
    }

    constructor(boardSocketManager: SocketBinder.Namespace, playerId: number) {
        const declareWar = new SocketBinder.EmitReceiveBinder<number | null>("declareWar", true, [`player${playerId}`]);
        declareWar.OnReceive(x => {

            if (x != null && x != undefined && this.warFlag == false && this.startWarCallback(x)) {
                this.warFlag = true;
            }
        });
        const surrender = new SocketBinder.EmitReceiveBinder("surrender", true, [`player${playerId}`]);

        surrender.OnReceive(() => this.surrender());
        boardSocketManager.addSocketBinder(declareWar, surrender);
    }

    surrender() {
        if (this.warFlag && this.surrenderCallback())
            this.warFlag = false;
    }

    onSurrender(f: () => WarSuccessFlag) {
        this.surrenderCallback = f;
    }
    onStartWar(f: (playerId: number) => WarSuccessFlag) {
        this.startWarCallback = f;
    }
}
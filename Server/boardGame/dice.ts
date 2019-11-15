import { SocketBinder } from "../socketBinder";
import { DiceData } from "../../Client/Share/diceData";

//ダイスを振る。1~3が返る。
export function diceRoll() {
    return Math.floor(Math.random() * 3) + 1;
}

export class Dice {
    private diceData: SocketBinder.Binder<DiceData>;
    private selectDiceCallback: (diceNumber: number) => void;

    constructor(playerId: number, boardSocketManager: SocketBinder.Namespace) {
        this.diceData =
            new SocketBinder.Binder<DiceData>("diceList" + playerId);
        const selectDice =
            new SocketBinder.EmitReceiveBinder<number>("selectDice", true, [`player${playerId}`]);
        selectDice.OnReceive(diceIndex =>
            this.selectDiceCallback(this.diceData.Value.diceNumber[diceIndex])
        );
        boardSocketManager.addSocketBinder(this.diceData, selectDice);
    }

    clear() {
        if (this.diceData.Value)
            this.diceData.Value.diceNumber = [];
        this.diceData.update();
    }

    onSelectDice(f: (diceNumber: number) => void) {
        this.selectDiceCallback = f;
    }

    diceRoll(causeText: string, uncertainty: number) {
        const Data: DiceData = {
            diceNumber: new Array(uncertainty).fill(0).map(() => diceRoll()),
            text: causeText
        };
        this.diceData.Value = Data;
    }

}
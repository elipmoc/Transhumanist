import { Namespace } from "../socketBinder/bindManager";
import { SocketBinder } from "../socketBinder";

export class ChatSe {
    constructor(boardSocketManager: Namespace) {

        ["ReminderBell", "Crap"].forEach(x => {
            const se = new SocketBinder.TriggerBinder<undefined, undefined>(x);
            boardSocketManager.addSocketBinder(se);
            se.OnReceive(() => {
                se.emit();
            })
        });

    }
}
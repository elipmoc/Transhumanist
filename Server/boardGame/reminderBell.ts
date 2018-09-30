import { Namespace } from "../socketBinder/bindManager";
import { SocketBinder } from "../socketBinder";

export class ReminderBell {
    constructor(boardSocketManager: Namespace) {
        const reminderBell = new SocketBinder.TriggerBinder<undefined, undefined>("ReminderBell");
        boardSocketManager.addSocketBinder(reminderBell);
        reminderBell.OnReceive(() => {
            reminderBell.emit();
        })
    }
}
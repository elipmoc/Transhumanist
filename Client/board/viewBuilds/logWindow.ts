import { LogMessage, LogWindow } from "../views/logWindow";
import { BindParams } from "../bindParams";
import { LogMessageForClient } from "../../../Share/logMessageForClient";
import { SocketBinderList } from "../../socketBinderList";

//ログウインドウの生成
export function build(bindParams: BindParams) {
    const logWindow = new LogWindow(bindParams.imgQueue);
    const logMessageList = new SocketBinderList<LogMessageForClient>("logMessageList", bindParams.socket);
    logMessageList.onUpdate(msgList => {
        msgList.forEach(msg => logWindow.addMessaage(new LogMessage(msg)));
        bindParams.stage.update();
    });
    logMessageList.onPush(msg => {
        logWindow.addMessaage(new LogMessage(msg));
        bindParams.stage.update();
    })
    bindParams.stage.addChild(logWindow);
}
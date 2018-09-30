import { BindParams } from "../bindParams";
import * as $ from "jquery";
import { SoundManager } from "../../soundManager";

//チャット送信フォーム
export function build(bindParams: BindParams) {
    const bellButton = $("#bellButton");
    const chatTextColor = $("#chatTextColor");
    const chatText = $("#chatText");
    const sendButton = $("#sendButton");
    bindParams.socket.on("ReminderBell", () => {
        SoundManager.sePlay("bell");
    })

    bellButton.click(function () {
        bindParams.socket.emit("ReminderBell");
    });
    sendButton.click(function () {
        bindParams.socket.emit("sendChatMessage", JSON.stringify(chatText.val()));
    });

}
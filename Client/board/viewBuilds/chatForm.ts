import { BindParams } from "../bindParams";
import * as $ from "jquery";
import { SoundManager } from "../../soundManager";

//チャット送信フォーム
export function build(bindParams: BindParams) {
    const bellButton = $("#bellButton");
    const clapButton = $("#clapButton");
    let chatText = $("#chatText");
    const sendButton = $("#sendButton");

    bindParams.socket.on("ReminderBell", () => {
        SoundManager.sePlay("bell");
    });
    bindParams.socket.on("ReminderClap", () => {
        SoundManager.sePlay("clap");
    });
    bellButton.click(function () {
        bindParams.socket.emit("ReminderBell");
    });
    clapButton.click(function () {
        bindParams.socket.emit("ReminderClap");
    });
    sendButton.click(function () {
        bindParams.socket.emit("sendChatMessage", JSON.stringify(chatText.val()));
        chatText.val("");
    });

}
import { BindParams } from "../bindParams";
import * as $ from "jquery";
import { SoundManager } from "../../soundManager";

//チャット送信フォーム
export function build(bindParams: BindParams) {
    const bellButton = $("#bellButton");
    const chatTextColor = $("#chatTextColor");
    const chatText = $("#chatText");
    const sendButton = $("#sendButton");

    bellButton.click(function () {
        SoundManager.sePlay("bell");       
    });
    sendButton.click(function () {
        bindParams.socket.emit("sendChatMessage", JSON.stringify(chatText.val()));
    });
    
}
import * as io from "socket.io-client";
import { viewBuild } from "./board/viewBuild"
import * as cookies from "js-cookie";
import { RequestBoardGameJoin } from "./Share/requestBoardGameJoin";
import { Yamls, getYamls } from "./getYaml";
import { ImageQueue } from "./board/imageQueue";
import { getSpriteJson } from "./getSpriteJson";
import { BgmChanger } from "./board/bgmChanger";
import { BackGroundChanger } from "./board/backGroundChanger";
import { LayerManager } from "./board/layerManager";
import { SoundManager } from "./soundManager";

const queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
window.onload = () => {

    queue.on("complete", async () => {
        const [yamls, spriteJson] = await Promise.all([getYamls(), getSpriteJson()])
        preloadImage(yamls, spriteJson);
    });
    queue.loadManifest([
        { id: "boardSprite", src: "./Resource/Sprite/boardSprite.png" },
        { id: "bell", src: "./Resource/Se/bell.mp3" },
        { id: "clap", src: "./Resource/Se/clap.mp3" },
        { id: "surrender", src: "./Resource/Se/surrender.mp3" },
        { id: "turnStart", src: "./Resource/Se/turnStart.mp3" },
        { id: "turnStart2", src: "./Resource/Se/turnStart2.mp3" },
        { id: "warAlarm", src: "./Resource/Se/warAlarm.mp3" },
    ], true);
}

export const enum LayerTag {
    BackGround = "backGround",
    UiUnder = "ui_under",
    Ui = "ui",
    UiOver = "ui_over",
    PopUp = "pop_up",
    PopUp2 = "pop_up2",
    Hover = "hover",
    OptionUi = "option_ui"
}

function getLayerTags(): string[] {
    return [
        LayerTag.BackGround,
        LayerTag.UiUnder,
        LayerTag.Ui,
        LayerTag.UiOver,
        LayerTag.PopUp,
        LayerTag.PopUp2,
        LayerTag.Hover,
        LayerTag.OptionUi
    ];
}

function preloadImage(yamls: Yamls, spriteJson: any) {
    let stage = new createjs.Stage("myCanvas");
    stage.enableMouseOver();
    const layerManager = new LayerManager(getLayerTags(), stage);
    const socket = io("https://trans-humanist.herokuapp.com" + `/room${Number(cookies.get("roomid"))}`);
    const imgQueue = new ImageQueue(queue, spriteJson);
    const bindParams = {
        imgQueue,
        layerManager,
        socket,
        playerId: Number(cookies.get("playerId")),
        yamls
    }

    let background = new BackGroundChanger(bindParams);
    layerManager.add("backGround", background);

    const requestBoardGameJoin: RequestBoardGameJoin = { uuid: cookies.get("uuid") };
    socket.emit("joinBoardGame", JSON.stringify(requestBoardGameJoin));
    socket.on("rejectBoardGame", () => {
        alert("部屋に参加出来ませんでした！");
        location.href = "./login.html";
    });
    socket.on("win", () => {
        SoundManager.sePlay("surrender");
    });

    viewBuild(bindParams);
    let bgmChanger = new BgmChanger(bindParams);

    layerManager.update();
}
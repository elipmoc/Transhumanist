import { global } from "./boardGlobalData"
import * as io from "socket.io-client";
import { viewBuild } from "./board/viewBuild"
import * as cookies from "js-cookie";
import { RequestBoardGameJoin } from "../Share/requestBoardGameJoin";
import { Yamls, getYamls } from "./getYaml";
import { SoundManager } from "./soundManager";
import { BackGround } from "./board/views/backGround";
import { ImageQueue } from "./board/imageQueue";
import { getSpriteJson } from "./getSpriteJson";
import { BgmChanger } from "./board/bgmChanger";

const queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
window.onload = () => {

    queue.on("complete", () => getYamls().then(yamls => {
        getSpriteJson().then(
            spriteJson => {
                preloadImage(yamls, spriteJson);
                return Promise.resolve();
            }
        )
    }));
    queue.loadManifest([
        /* { id: "evenPlayerFrame", src: "Img/ui/evenPlayerFrame.png" },
         { id: "evenPlayerFrame2", src: "Img/ui/evenPlayerFrame2.png" },
         { id: "oddPlayerFrame", src: "Img/ui/oddPlayerFrame.png" },
         { id: "oddPlayerFrame2", src: "Img/ui/oddPlayerFrame2.png" },
         { id: "topWindows", src: "Img/ui/topWindows.png" },
         { id: "setting", src: "Img/ui/setting.png" },
         { id: "evenPlayerRBArea", src: "Img/ui/evenPlayerRBArea.png" },
         { id: "oddPlayerRBArea", src: "Img/ui/oddPlayerRBArea.png" },
         { id: "logEvent", src: "Img/ui/logEvent.png" },
         { id: "button", src: "Img/ui/button.png" },
         { id: "actionStorageFrame", src: "Img/ui/actionStorageFrame.png" },
         { id: "optionWindow", src: "Img/ui/optionWindow.png" },
         { id: "optionCross", src: "Img/ui/optionCross.png" },
         { id: "optionVolumeBar", src: "Img/ui/optionVolumeBar.png" },
         { id: "optionVolumeCursor", src: "Img/ui/optionVolumeCursor.png" },
         { id: "b_level1", src: "Img/card/back/level1mb.png" },
         { id: "b_level2", src: "Img/card/back/level2mb.png" },
         { id: "b_level3", src: "Img/card/back/level3mb.png" },
         { id: "b_level4", src: "Img/card/back/level4mb.png" },
         { id: "b_level5", src: "Img/card/back/level5mb.png" },
         { id: "b_level6", src: "Img/card/back/level6mb.png" },
         { id: "f_level1", src: "Img/card/front/action/level1.png" },
         { id: "f_level2", src: "Img/card/front/action/level2.png" },
         { id: "f_level3", src: "Img/card/front/action/level3.png" },
         { id: "f_level4", src: "Img/card/front/action/level4.png" },
         { id: "f_level5", src: "Img/card/front/action/level5.png" },
         { id: "f_level6", src: "Img/card/front/action/level6.png" },
         { id: "miningAction", src: "Img/card/front/action/mining.png" },
         { id: "意識操作のテスト", src: "Img/card/front/action/意識操作のテスト.png" },
         { id: "核融合炉", src: "Img/card/front/action/核融合炉.png" },
         { id: "量子コンピュータ", src: "Img/card/front/action/量子コンピュータ.png" },
         { id: "治療施設", src: "Img/card/front/action/治療施設.png" },
         { id: "resource", src: "Img/resource.png" },
         { id: "buildAction", src: "Img/buildAction.png" },
         { id: "logFrame", src: "Img/ui/logFrame.png" },
         { id: "eventFrame", src: "Img/ui/eventFrame.png" },
         { id: "gm_icon", src: "Img/gmIcon.png" },*/
        { id: "boardSprite", src: "Img/boardSprite.png" },
        { id: "bell", src: "Se/bell.mp3" },
        { id: "clap", src: "Se/clap.mp3" },
        { id: "surrender", src: "Se/surrender.mp3" },
        { id: "turnStart", src: "Se/turnStart.mp3" },
        { id: "turnStart2", src: "Se/turnStart2.mp3" },
        { id: "warAlarm", src: "Se/warAlarm.mp3" },
    ]);
}

function preloadImage(yamls: Yamls, spriteJson: any) {
    SoundManager.bgmPlay("bgm_level3");
    let stage = new createjs.Stage("myCanvas");
    stage.enableMouseOver();
    let background = new BackGround();
    stage.addChild(background);
    background.setBg("bg_level5");

    const socket = io("/board");
    const imgQueue = new ImageQueue(queue, spriteJson);
    const requestBoardGameJoin: RequestBoardGameJoin = { uuid: cookies.get("uuid"), roomid: Number(cookies.get("roomid")) };
    socket.emit("joinBoardGame", JSON.stringify(requestBoardGameJoin));

    const bindParams = {
        imgQueue,
        stage,
        socket,
        playerId: Number(cookies.get("playerId")),
        yamls
    }
    viewBuild(bindParams);
    let bgmChanger = new BgmChanger(bindParams);
        
    stage.update();
}
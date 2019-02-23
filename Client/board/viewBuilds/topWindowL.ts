import { OptionWindow } from "../views/optionWindow";
import { TopWindowL } from "../views/topWindowL";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { global } from "../../boardGlobalData";
import { LayerTag } from "../../board";

//左上のやつ生成
export function build(bindParams: BindParams) {
    //オプションウインドウ生成
    const optionWindow = new OptionWindow(bindParams.imgQueue);
    optionWindow.x = global.canvasWidth / 2;
    optionWindow.y = global.canvasHeight / 2;
    optionWindow.visible = false;

    bindParams.socket.on("leaveRoom", () => {
        location.href = "login.html";
    });

    optionWindow.ruleOnClick(
        () => {
            window.open("https://trans-humanist.github.io/rule.html");
            optionWindow.visible = false;
            bindParams.layerManager.update();
        }
    );
    optionWindow.cardOnClick(
        () => {
            window.open("https://docs.google.com/spreadsheets/d/1dHAVu22c1Nnja4mWB-1F4FwKamqBAMuVcnkql3mSRIo/edit?usp=sharing");
            optionWindow.visible = false;
            bindParams.layerManager.update();
        }
    );
    optionWindow.formOnClick(
        () => {
            window.open("https://goo.gl/forms/9tx8kwYic59Hj7WB2");
            optionWindow.visible = false;
            bindParams.layerManager.update();
        }
    );
    optionWindow.leaveOnClick(
        () => {
            bindParams.socket.emit("leaveRoom");

            optionWindow.visible = false;
            bindParams.layerManager.update();
        }
    );
    optionWindow.endOnClick(
        () => {
            bindParams.socket.emit("gameEnd");
            optionWindow.visible = false;
            bindParams.layerManager.update();
        }
    );

    bindParams.layerManager.add(LayerTag.OptionUi, optionWindow);
    const gameMasterPlayerId = new SocketBinder<number | null>("gameMasterPlayerId", bindParams.socket);
    optionWindow.visibleGameEndButton = false;
    gameMasterPlayerId.onUpdate(id => {
        optionWindow.visibleGameEndButton = id == bindParams.playerId;
        bindParams.layerManager.update();
    })


    //左上のやつ生成
    const topWindowL = new TopWindowL(bindParams.imgQueue, optionWindow);
    const turn = new SocketBinder<number>("turn", bindParams.socket);
    turn.onUpdate(x => { topWindowL.setTurn(x); bindParams.layerManager.update(); });
    bindParams.layerManager.add(LayerTag.Ui, topWindowL);
}
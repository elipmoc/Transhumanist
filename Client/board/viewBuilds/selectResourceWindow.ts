import { SelectResourceWindow } from "../views/selectResourceWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";

export function build(bindParams: BindParams) {
    //選択可能なリソースの最大数
    const maxLength: number = 6;
    const selectResourceWindow = new SelectResourceWindow(maxLength);
    selectResourceWindow.visible = false;

    //onClickの設定
    selectResourceWindow.onClickIcon((cardIcon) => { 
        bindParams.socket.emit("selectedGetResource", cardIcon.Kind);
        console.log(cardIcon.Kind);
        selectResourceWindow.decreaseNumber();
        if (selectResourceWindow.getNumber() <= 0) {
            selectResourceWindow.visible = false;
            
        }
        bindParams.layerManager.update();
    });

    //とりあえず表示すべきものが来たとする。
    const serverData = {
        number: 3,
        resources: ["人間", "メタル", "ガス", "ケイ素", "硫黄", "人間"]
    };
    //リソースセット
    for (let i = 0; maxLength > i; i++){
        let resourceName: string = serverData.resources[i];
        selectResourceWindow.setResource(
            i,
            resourceName,
            resourceName != "" ? bindParams.yamls.resourceHash[resourceName].index : -1,
            bindParams.imgQueue
        );
    }
    //ナンバーぶちこみ
    selectResourceWindow.setNumber(serverData.number);
    selectResourceWindow.visible = true;

    bindParams.layerManager.add(LayerTag.PopUp, selectResourceWindow);
}
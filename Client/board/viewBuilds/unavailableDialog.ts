import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { UnavailableDialog } from "../views/unavailableDialog";
import { UnavailableState } from "../../../Share/unavailableState";

export function build(bindParams: BindParams) {
    const unavailableDialog = new UnavailableDialog();
    unavailableDialog.visible = false;

    //onClickの設定
    unavailableDialog.onClick(() => {
        unavailableDialog.visible = false;
        bindParams.layerManager.update();
    });

    bindParams.socket.on("Unavailable", (data: any) => {
        const state = JSON.parse(data);
        switch (state) {
            case UnavailableState.Cost:
                unavailableDialog.setText("コストが足りていない為、\nカードを使用出来ません。");
                break;

            case UnavailableState.War:
                unavailableDialog.setText("戦争状態でない為、\nカードを使用出来ません。");
                break;

            case UnavailableState.Condition:
                unavailableDialog.setText("条件が満たされていない為、\nカードを使用出来ません。");
                break;
            case UnavailableState.Event:
                unavailableDialog.setText("イベントの効果により、\nカードを使用出来ません。");
                break;
        };
        unavailableDialog.visible = true;
        unavailableDialog.stage.update();
    });

    bindParams.layerManager.add(LayerTag.PopUp, unavailableDialog);
}
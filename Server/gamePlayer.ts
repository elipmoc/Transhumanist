import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";
import { SocketBinderList } from "./socketBinderList";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceIndex, GenerateResourceYamlData, ResourceName } from "../Share/Yaml/resourceYamlData";
import { yamlGet } from "./yamlGet";
import { GenerateActionCardYamlData } from "../Share/Yaml/actionCardYamlDataGen";
import { ActionCardName } from "../Share/Yaml/actionCardYamlData";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    private resourceList: SocketBinderList<ResourceName>;
    private buildActionList: SocketBinderList<ActionCardName>;
    private diceList: SocketBinder<DiceNumber[]>;
    private actionCardList: SocketBinderList<string | null>;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }

    constructor(
        playerData: PlayerData,
        playerId: number,
        state: SocketBinder<GamePlayerState>,
        resourceList: SocketBinderList<ResourceName>,
        buildActionList: SocketBinderList<ActionCardName>,
        diceList: SocketBinder<DiceNumber[]>,
        actionCardList: SocketBinderList<string | null>
    ) {
        this.diceList = diceList;
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = state;
        this.resourceList = resourceList;
        this.buildActionList = buildActionList;
        this.actionCardList = actionCardList;
        this.state.Value = {
            playerName: playerData.getName(),
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
        const buildAction = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), true);
        this.buildActionList.Value = [
            "採掘施設",
            "治療施設",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "教会",
            "核融合炉",
            "ロボット工場",
        ];
        const resourceAction = GenerateResourceYamlData(yamlGet("./Resource/Yaml/resource.yaml"));
        this.resourceList.Value = [
            "人間",
            "人間",
            "人間",
            "人間",
            "人間",
            "聖書",
            "聖書",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "CPU",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
            "拡張人間",
        ];
        const actionCard = GenerateActionCardYamlData(yamlGet("./Resource/Yaml/actionCard.yaml"), false);
        actionCardList.Value = [null, null, "神の杖", null, null];
        actionCardList.setAt(0, "意識操作のテスト")

    }

    //ユーザーにsocketBinderの値を送信する
    sendToSocket(socket: SocketIO.Socket) {
        this.state.updateAt(socket);
        this.resourceList.updateAt(socket);
        this.buildActionList.updateAt(socket);
        this.diceList.updateAt(socket);
        this.actionCardList.addSocket(socket);
    }
}
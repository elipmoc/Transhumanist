import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";
import { SocketBinderList } from "./socketBinderList";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceIndex, GenerateResourceYamlData } from "../Share/Yaml/resourceYamlData";
import { yamlGet } from "../Share/Yaml/yamlGet";
import { BuildActionIndex, GenerateActionCardYamlData } from "../Share/Yaml/actionCardYamlDataGen";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    private resourceList: SocketBinderList<ResourceIndex>;
    private buildActionList: SocketBinderList<BuildActionIndex>;
    private diceList: SocketBinder<DiceNumber[]>;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }

    constructor(
        playerData: PlayerData,
        playerId: number,
        state: SocketBinder<GamePlayerState>,
        resourceList: SocketBinderList<ResourceIndex>,
        buildActionList: SocketBinderList<BuildActionIndex>,
        diceList: SocketBinder<DiceNumber[]>
    ) {
        this.diceList = diceList;
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = state;
        this.resourceList = resourceList;
        this.buildActionList = buildActionList;
        this.state.Value = {
            playerName: playerData.getName(),
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
        const buildAction = GenerateActionCardYamlData(yamlGet("./Resource/yamls/actionCard.yaml"), true);
        this.buildActionList.Value = [
            buildAction["採掘施設"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["教会"].index,
            buildAction["核融合炉"].index,
            buildAction["ロボット工場"].index,
        ];
        const resourceAction = GenerateResourceYamlData(yamlGet("./Resource/yamls/resource.yaml"));
        this.resourceList.Value = [
            resourceAction["人間"].index,
            resourceAction["人間"].index,
            resourceAction["人間"].index,
            resourceAction["人間"].index,
            resourceAction["人間"].index,
            resourceAction["聖書"].index,
            resourceAction["聖書"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["CPU"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
            resourceAction["拡張人間"].index,
        ];
    }

    //ユーザーにsocketBinderの値を送信する
    sendToSocket(socket: SocketIO.Socket) {
        this.state.updateAt(socket);
        this.resourceList.updateAt(socket);
        this.buildActionList.updateAt(socket);
        this.diceList.updateAt(socket);
    }
}
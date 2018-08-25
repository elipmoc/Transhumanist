import { SocketBinder } from "./socketBinder";
import { ResponseGamePlayerState } from "../Share/responseGamePlayerState";
import { StartStatusYamlData } from "../Share/Yaml/startStatusYamlData";

export class GamePlayerState {
    private state: SocketBinder<ResponseGamePlayerState>;

    constructor(state: SocketBinder<ResponseGamePlayerState>, playerName: string) {
        this.state = state;
        this.state.Value = {
            playerName: playerName,
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
    }

    setAICard(startStatusYamlData: StartStatusYamlData) {
        this.state.Value.activityRange = startStatusYamlData.activityRange;
        this.state.Value.resource = startStatusYamlData.resource;
        this.state.Value.speed = startStatusYamlData.speed;
        this.state.Value.uncertainty = startStatusYamlData.uncertainty;
        this.state.update();
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.state.updateAt(socket);
    }
}
import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";

export class GamePlayerState {
    private state: SocketBinder.Binder<ResponseGamePlayerState>;

    get State() { return this.state.Value; }

    constructor(state: SocketBinder.Binder<ResponseGamePlayerState>, playerName: string) {
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
}
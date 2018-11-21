import { ResponseGamePlayerState } from "../../Share/responseGamePlayerState";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { SocketBinder } from "../socketBinder";

export class GamePlayerState {
    private state: SocketBinder.Binder<ResponseGamePlayerState>;
    private beforeActivityRange: number;
    private afterActivityRange: number;
    private temporarilyNow: boolean;
  
    get State() { return this.state.Value; }
        
    constructor(state: SocketBinder.Binder<ResponseGamePlayerState>) {
        this.state = state;
        this.state.Value = {
            playerName: "",
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
    }

    setPlayerName(playerName: string) {
        this.state.Value.playerName = playerName;
        this.state.update();
    }

    clear() {
        this.state.Value = {
            playerName: "",
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
    }

    reset() {
        this.state.Value = {
            playerName: this.state.Value.playerName,
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
    }

    addPositive(num:number) {
        this.state.Value.positive += num;
        if (this.state.Value.positive >= 30) this.state.Value.positive = 30;
        else if (this.state.Value.positive <= 0) this.state.Value.positive = 0;
    }

    addNegative(num: number) {
        this.state.Value.negative += num;
        if (this.state.Value.negative >= 30) this.state.Value.negative = 30;
        else if (this.state.Value.negative <= 0) this.state.Value.negative = 0;
    }

    //加減対応済み
    addAcivityRange(num: number) {
        if (this.temporarilyNow) {
            this.beforeActivityRange += num;
            this.afterActivityRange += num;

            if (this.afterActivityRange >= 30) this.state.Value.activityRange = 30;
            else if (this.afterActivityRange <= 0) this.state.Value.activityRange = 0;
            else this.state.Value.activityRange = this.afterActivityRange;

        } else {
            this.state.Value.activityRange += num;
            if (this.state.Value.activityRange >= 30) this.state.Value.activityRange = 30;
            else if (this.state.Value.activityRange <= 0) this.state.Value.activityRange = 0;
        }
    }

    //加減対応済み
    temporarilyActivityRangeSet(num: number) {
        this.temporarilyNow = true;
        this.beforeActivityRange = this.state.Value.activityRange;
        this.afterActivityRange = this.beforeActivityRange += num;

        if (this.afterActivityRange >= 30) this.state.Value.activityRange = 30;
        else if (this.afterActivityRange <= 0) this.state.Value.activityRange = 0;
        else this.state.Value.activityRange = this.afterActivityRange;
    }

    //加減対応済み
    temporarilyReset() {
        this.temporarilyNow = false;
        this.state.Value.activityRange = this.beforeActivityRange;
        if (this.state.Value.activityRange >= 30) this.state.Value.activityRange = 30;
        else if (this.state.Value.activityRange <= 0) this.state.Value.activityRange = 0;
    }

    setAICard(startStatusYamlData: StartStatusYamlData) {
        this.state.Value.activityRange = startStatusYamlData.activityRange;
        this.state.Value.resource = startStatusYamlData.resource;
        this.state.Value.speed = startStatusYamlData.speed;
        this.state.Value.uncertainty = startStatusYamlData.uncertainty;
        this.state.update();
    }

    winWar() {
        this.state.Value.positive += 2;
        this.state.Value.negative -= 2;
        this.state.Value.negative =
            this.state.Value.negative < 0 ? 0 : this.state.Value.negative;
        this.state.update();
    }

    loseWar() {
        this.state.Value.positive++;
        this.state.Value.negative += 2;
        this.state.update();
    }
    warStateChange() {
        if (this.state.Value.positive <= 0)
            this.state.Value.negative++;
        else
            this.state.Value.positive--;
        this.state.update();
    }
}
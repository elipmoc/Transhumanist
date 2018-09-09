import { yamlGet } from "../../yamlGet";
import { GenerateEventYamlDataArray, Event } from "../../../Share/Yaml/eventYamlData"
import { arrayshuffle } from "../../../Share/utility";
export class EventCardStack {
    private eventCardList: Event[] = [];
    constructor() {
        const eventCardGroups = new Array(6);
        for (let i = 0; i < 6; i++) {
            eventCardGroups[i] = [];
        }
        GenerateEventYamlDataArray(yamlGet("./Resource/Yaml/event.yaml")).forEach(x => {
            eventCardGroups[x.level - 1].push(x);
        });
        eventCardGroups.forEach(x => {
            arrayshuffle(x);
            this.eventCardList = x.concat(this.eventCardList);
        });
    }

    draw() {
        return this.eventCardList.pop();
    }
}
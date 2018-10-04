import { yamlGet } from "../../yamlGet";
import { GenerateEventYamlDataArray, Event } from "../../../Share/Yaml/eventYamlData"
import { arrayshuffle } from "../../../Share/utility";
import { NumberOfEventCard } from "../../../Share/numberOfEventCard";
import { SocketBinder } from "../../socketBinder";
import { EventLogMessageForClient } from "../../../Share/eventLogMessageForClient";

export class EventCardStack {
    private eventCardList: Event[] = [];
    private numberOfEventCard: SocketBinder.Binder<NumberOfEventCard>;
    private eventLogMessage: SocketBinder.Binder<EventLogMessageForClient>;

    constructor(boardSocketManager: SocketBinder.Namespace) {
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
        this.numberOfEventCard = new SocketBinder.Binder("numberOfEventCard");
        this.numberOfEventCard.Value = {
            currentNumber: this.eventCardList.length,
            maxNumber: this.eventCardList.length
        }

        this.eventLogMessage = new SocketBinder.Binder<EventLogMessageForClient>("eventLogMessage");
        this.eventLogMessage.Value = new EventLogMessageForClient("", "");

        boardSocketManager.addSocketBinder(this.numberOfEventCard, this.eventLogMessage);
    }

    draw() {
        const drawEvent = this.eventCardList.pop();
        this.numberOfEventCard.Value.currentNumber = this.eventCardList.length
        this.numberOfEventCard.update();
        this.setEventMessage(drawEvent);
        return drawEvent;
    }

    setEventMessage(event: Event | undefined) {
        if (event != undefined) {
            this.eventLogMessage.Value = new EventLogMessageForClient(`イベント【${event.name}】が発生しました`,event.description);
        }
    }
}
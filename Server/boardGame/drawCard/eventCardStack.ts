import { yamlGet } from "../../yamlGet";
import { GenerateEventYamlDataArray, Event } from "../../../Client/src/Share/Yaml/eventYamlData"
import { arrayshuffle } from "../../../Client/src/Share/utility";
import { NumberOfEventCard } from "../../../Client/src/Share/numberOfEventCard";
import { SocketBinder } from "../../socketBinder";
import { EventLogMessageForClient } from "../../../Client/src/Share/eventLogMessageForClient";
import { FutureForecastEventData } from "../../../Client/src/Share/futureForecastEventData";

export class EventCardStack {
    private eventCardList: Event[] = [];
    private numberOfEventCard: SocketBinder.Binder<NumberOfEventCard>;
    private eventLogMessage: SocketBinder.Binder<EventLogMessageForClient>;

    constructor(boardSocketManager: SocketBinder.Namespace) {
        this.numberOfEventCard = new SocketBinder.Binder("numberOfEventCard");
        this.eventLogMessage = new SocketBinder.Binder<EventLogMessageForClient>("eventLogMessage");
        this.settingCard();
        boardSocketManager.addSocketBinder(this.numberOfEventCard, this.eventLogMessage);
    }

    //現在残っているイベントの山札を取得する（コピーした配列を渡している）
    getEvents() {
        return this.eventCardList.slice();
    }

    //イベントを先頭から順に組み替える
    swapEvents(data: FutureForecastEventData) {
        if (this.eventCardList.length < data.eventNameList.length) return false;
        const eventCardListHeads = this.eventCardList.slice(0, this.eventCardList.length - data.eventNameList.length);
        let eventCardListTails = this.eventCardList.slice(this.eventCardList.length - data.eventNameList.length, this.eventCardList.length);
        //イベントが全く関係ないイベントとすり替わってないかチェック
        if (eventCardListTails.every(x => data.eventNameList.some(eventName => x.name == eventName)) == false)
            return false;

        eventCardListTails = data.eventNameList.map(eventName => eventCardListTails.find(x => x.name == eventName)!);
        this.eventCardList = eventCardListHeads.concat(eventCardListTails);
        return true;
    }

    settingCard() {
        this.eventCardList = [];
        const eventCardGroups = new Array(6);
        for (let i = 0; i < 6; i++) {
            eventCardGroups[i] = [];
        }
        GenerateEventYamlDataArray(yamlGet("./Client/public/Resource/Yaml/event.yaml")).forEach(x => {
            eventCardGroups[x.level - 1].push(x);
        });
        eventCardGroups.forEach(x => {
            arrayshuffle(x);
            this.eventCardList = x.concat(this.eventCardList);
        });
        this.numberOfEventCard.Value = {
            currentNumber: this.eventCardList.length,
            maxNumber: this.eventCardList.length
        }

        this.eventLogMessage.Value = new EventLogMessageForClient("", "");
    }

    draw() {
        const drawEvent = this.eventCardList.pop();
        this.numberOfEventCard.Value.currentNumber = this.eventCardList.length
        this.numberOfEventCard.update();
        this.setEventMessage(drawEvent);
        return drawEvent;
    }

    private setEventMessage(event: Event | undefined) {
        if (event != undefined) {
            this.eventLogMessage.Value = new EventLogMessageForClient(`イベント：【${event.name}】`, event.description);
        }
    }
}
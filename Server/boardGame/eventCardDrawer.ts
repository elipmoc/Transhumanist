import { EventCardStack } from "./drawCard/eventCardStack";
import { SocketBinder } from "../socketBinder";
import { Event } from "../../Client/Share/Yaml/eventYamlData";
import { FutureForecastEventData } from "../../Client/Share/futureForecastEventData";

export class EventCardDrawer {
    private eventCardStack: EventCardStack;

    private nowEvent = new SocketBinder.Binder<Event | null>("nowEvent");
    constructor(boardSocketManager: SocketBinder.Namespace) {
        this.eventCardStack = new EventCardStack(boardSocketManager);
        boardSocketManager.addSocketBinder(this.nowEvent);
    }

    reset() {
        this.eventCardStack.settingCard();
        this.nowEvent.Value = null;
    }

    get NowEvent() {
        return this.nowEvent.Value;
    }

    getEvents() {
        return this.eventCardStack.getEvents();
    }

    //イベントを先頭から順に組み替える
    swapEvents(data: FutureForecastEventData) {
        return this.eventCardStack.swapEvents(data);
    }

    draw() {
        const eventCard = this.eventCardStack.draw();
        if (eventCard != undefined)
            this.nowEvent.Value = eventCard;
    }
}
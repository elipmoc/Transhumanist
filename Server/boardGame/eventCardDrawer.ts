import { EventCardStack } from "./drawCard/eventCardStack";
import { SocketBinder } from "../socketBinder";
import { Event } from "../../Share/Yaml/eventYamlData";

export class EventCardDrawer {
    private eventCardStack: EventCardStack;
    private nowEvent = new SocketBinder.Binder<Event | null>("nowEvent");
    constructor(eventCardStack: EventCardStack, boardSocketManager: SocketBinder.Namespace) {
        this.eventCardStack = eventCardStack;
        boardSocketManager.addSocketBinder(this.nowEvent);
    }

    reset() {
        this.nowEvent.Value = null;
    }
    draw() {
        const eventCard = this.eventCardStack.draw();
        if (eventCard != undefined)
            this.nowEvent.Value = eventCard;
    }
}
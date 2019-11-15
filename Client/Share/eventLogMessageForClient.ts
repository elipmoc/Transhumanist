export class EventLogMessageForClient {
    readonly eventTitle: string;
    readonly eventDescription: string;
    constructor(eventTitle: string, eventDescription: string) {
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
    }
}
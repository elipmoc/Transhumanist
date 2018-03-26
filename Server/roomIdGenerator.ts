export class RoomIdGenerator{
    private unUsedId:number[];
    constructor(){
        this.unUsedId = new Array(100);
        for(let i=0;i<this.unUsedId.length;i++){
            this.unUsedId[i] = i++;
        }
    }
    getRoomId(){
        return this.unUsedId.length > 0 ? this.unUsedId.pop()! : null
    }
    releaseRoomId(roomId:number){
        if(this.unUsedId.find(x => x == roomId) == undefined){
            this.unUsedId.push(roomId);
        }
    }
}
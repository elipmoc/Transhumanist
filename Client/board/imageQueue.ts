import { clipBitmap } from "../utility";

export class ImageQueue {
    private sprite: createjs.Bitmap;
    private spriteJson: { [index: string]: { x: number, y: number, width: number, height: number } };
    constructor(queue: createjs.LoadQueue, spriteJson: any) {
        this.sprite = new createjs.Bitmap(queue.getResult("boardSprite"));
        this.spriteJson = spriteJson;
    }

    getImage(name: string) {
        console.log(name);
        const info = this.spriteJson[name];
        if (info == undefined) {
            console.log("まだ用意されていないリソース" + name);
            return new createjs.Bitmap("");
        }
        return clipBitmap(this.sprite, info.x, info.y, info.width, info.height);
    }
}
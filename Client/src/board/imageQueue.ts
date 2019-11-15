import { clipBitmap } from "../utility";

export class ImageQueue {
    private sprite: createjs.Bitmap;
    private spriteJson: { [index: string]: { x: number, y: number, width: number, height: number } };
    constructor(queue: createjs.LoadQueue, spriteJson: any) {
        this.sprite = new createjs.Bitmap(queue.getResult("boardSprite"));
        this.spriteJson = spriteJson;
    }

    getImage(name: string) {
        const info = this.spriteJson[name];
        if (info == undefined) {
            return new createjs.Bitmap("");
        }
        return clipBitmap(this.sprite, info.x, info.y, info.width, info.height);
    }
}
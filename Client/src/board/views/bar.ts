import { ImageQueue } from "../imageQueue";

//バー
export class Bar extends createjs.Container {
    private optionVolumeCursor: createjs.Bitmap;
    private maxX: number;
    private minX: number = 0;
    private callBack: (value: number) => void = (value) => { };
    constructor(queue: ImageQueue) {
        super();

        const optionVolumeBar = queue.getImage("optionVolumeBar");
        optionVolumeBar.regY = optionVolumeBar.image.height / 2;
        this.maxX = optionVolumeBar.image.width;
        this.addChild(optionVolumeBar);
        this.optionVolumeCursor = queue.getImage("optionVolumeCursor");
        this.optionVolumeCursor.regX = this.optionVolumeCursor.image.width / 2;
        this.optionVolumeCursor.regY = this.optionVolumeCursor.image.width / 2;
        this.addEventListener("pressmove", _ => {
            this.setBarCursorX(this.stage.mouseX);
        });
        this.addEventListener("mousedown", _ => {
            this.setBarCursorX(this.stage.mouseX);
        })
        this.addChild(this.optionVolumeCursor);
    }

    private setBarCursorX(x: number) {
        x = this.globalToLocal(x, 0).x;
        if (x > this.maxX)
            this.optionVolumeCursor.x = this.maxX;
        else if (x < this.minX)
            this.optionVolumeCursor.x = this.minX;
        else
            this.optionVolumeCursor.x = x;
        this.stage.update();
        this.callBack(x / this.maxX);
    }

    setBarValue(value: number) {
        this.optionVolumeCursor.x = this.minX + (this.maxX - this.minX) * value;
        this.callBack(value);
    }

    onChangedValue(callBack: (value: number) => void) {
        this.callBack = callBack;
    }
}
//バー
export class Bar extends createjs.Container {
    private optionVolumeCursor: createjs.Bitmap;
    private maxValue: number = 100;
    private minValue: number = 0;
    private maxX: number;
    private minX: number = 0;
    private callBack: (value: number) => void;
    constructor(queue: createjs.LoadQueue) {
        super();

        const optionVolumeBar = new createjs.Bitmap(queue.getResult("optionVolumeBar"));
        optionVolumeBar.regY = optionVolumeBar.image.height / 2;
        this.maxX = optionVolumeBar.image.width;
        this.addChild(optionVolumeBar);
        this.optionVolumeCursor = new createjs.Bitmap(queue.getResult("optionVolumeCursor"));
        this.optionVolumeCursor.regX = this.optionVolumeCursor.image.width / 2;
        this.optionVolumeCursor.regY = this.optionVolumeCursor.image.width / 2;
        this.addEventListener("pressmove", event => {
            this.setBarCursorX(this.stage.mouseX);
        });
        this.addEventListener("mousedown", event => {
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
    }

    onChangedValue(callBack: (value: number) => void) {
        this.callBack = callBack;
    }
}
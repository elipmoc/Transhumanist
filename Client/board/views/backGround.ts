const mapping: { [index: string]: string } = {
    "bg_level1": "Img/background/bg_level1.png",
    "bg_level2": "Img/background/bg_level2.png",
    "bg_level3": "Img/background/bg_level3.png",
    "bg_level4": "Img/background/bg_level4.png",
    "bg_level5": "Img/background/bg_level5.png",
    "bg_level6": "Img/background/bg_level6.png",
};

export class BackGround extends createjs.Container {
    private bg: createjs.Bitmap = new createjs.Bitmap("");
    private queue = new createjs.LoadQueue();
    constructor() {
        super();
        this.addChild(this.bg);
    }
    setBg(id: string) {
        this.queue.loadManifest([{ id: id, src: mapping[id] }]);
        this.queue.on("complete", () => {
            this.bg.image = <any>this.queue.getResult(id);
            this.bg.alpha = 0.5;
            this.stage.update();
        });
    }

}
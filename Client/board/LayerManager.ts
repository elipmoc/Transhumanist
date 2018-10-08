export class LayerManager {
    private mapping: { [name: string]: (createjs.Container | undefined) };
    private stage: createjs.Stage;

    constructor(layer_tags: string[], stage: createjs.Stage) {
        this.stage = stage;
        this.mapping = {};
        layer_tags.forEach(x => {
            const container = new createjs.Container();
            this.stage.addChild(container);
            this.mapping[x] = container;
        });
    }

    add(key: string, obj: createjs.DisplayObject) {
        if (this.mapping[key] == undefined) throw `undefined mapping_key:${key}`;
        this.mapping[key].addChild(obj);
    }
    update() {
        this.stage.update();
    }
}
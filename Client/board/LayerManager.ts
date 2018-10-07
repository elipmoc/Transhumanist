export class LayerManager extends createjs.Container {
    private mapping: { [name: string]: (number | undefined) }

    constructor(mapping: { [name: string]: (number | undefined) }) {
        super();
        this.mapping = mapping;
    }

    add(key: string, obj: createjs.DisplayObject) {
        if (this.mapping[key] == undefined) throw `undefined mapping_key:${key}`;
        this.addChildAt(obj, this.mapping[key]);
    }
}
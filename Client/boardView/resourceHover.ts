import * as global from "../boardGlobalData";
import { ResourceYamlData } from "../../Share/Yaml/resourceYamlData";
import { getIconResource } from "../utility";

export class ResourceHover extends createjs.Container {
    //テスト用の画像
    private hogehoge: createjs.Bitmap;

    constructor(yamlData: ResourceYamlData, queue: createjs.LoadQueue) {
        super();
        this.hogehoge = new createjs.Bitmap("");
        this.setYamlData(yamlData, queue);
        this.scaleX = 10;
        this.scaleY = 10;
        this.addChild(this.hogehoge);
        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight / 2;

    }
    setYamlData(yamlData: ResourceYamlData | null, queue: createjs.LoadQueue) {
        if (yamlData != null) {
            this.hogehoge.image = getIconResource(yamlData.index, "resource", queue);
        }
    }
}
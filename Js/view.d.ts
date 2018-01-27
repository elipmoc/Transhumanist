/// <reference types="easeljs" />
export declare class PlayerInfo {
    playerName: string;
    speed: number;
    resource: number;
    activityRange: number;
    uncertainty: number;
    positive: number;
    negative: number;
}
export declare class PlayerWindowBase {
    protected playerNameText: createjs.Text;
    protected speedText: createjs.Text;
    protected resourceText: createjs.Text;
    protected activityRange: createjs.Text;
    protected uncertainty: createjs.Text;
    protected positive: createjs.Text;
    protected negative: createjs.Text;
    protected playerFrame: createjs.Bitmap;
    constructor();
}
export declare class Player1Window extends PlayerWindowBase {
    constructor();
}

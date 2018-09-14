import { global } from "./boardGlobalData"
import { ImageQueue } from "./board/imageQueue";


//Bitmapから一部を切り取って新しいBitmapを作る関数
export function clipBitmap(
    bitmap: createjs.Bitmap,
    clipX: number, clipY: number,
    clipWidth: number, clipHeight: number) {
    var img = bitmap.image;

    //context化のためのcanvasを新しく生成する
    var clipCanvas = document.createElement("canvas");
    clipCanvas.setAttribute("width", String(clipWidth));
    clipCanvas.setAttribute("height", String(clipHeight));

    //contextを取得
    var context = clipCanvas.getContext("2d");

    //描画
    context.drawImage(
        img,
        clipX, clipY, clipWidth, clipHeight,
        0, 0, clipWidth, clipHeight
    );

    //Bitmapを生成
    return new createjs.Bitmap(clipCanvas);
}

//カードアイコンの画像取得
export function getIconResource(imgIndex: number, img_name: string, queue: ImageQueue) {
    if (imgIndex == -1)
        return null;
    const bitmap = clipBitmap(
        queue.getImage(img_name),
        imgIndex % 5 * global.cardIconSize,
        Math.floor(imgIndex / 5) * global.cardIconSize,
        global.cardIconSize, global.cardIconSize);
    return bitmap.image;
}

export function createMyShadow() {
    return new createjs.Shadow("black", 2, 2, 2);
}
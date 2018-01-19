
window.onload = () => {
    let stage = new createjs.Stage("myCanvas");
    let background = new createjs.Shape();
    background.graphics.beginFill("black").
        drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    background.x = 0;
    background.y = 0;
    stage.addChild(background);
    var bmp = new createjs.Bitmap("Img/ui/evenPlayerFrame.png");
    bmp.regX = bmp.image.width / 2;
    bmp.regY = 0;
    bmp.x = stage.canvas.width / 2;
    stage.addChild(bmp);
    stage.update();
}
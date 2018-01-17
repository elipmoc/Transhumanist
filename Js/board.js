enchant();

function createBackColorSprite(width, height) {
    let backColorSprite = new Sprite(width, height);
    let surface = new Surface(width, height);
    surface.context.beginPath();
    surface.context.fillStyle = "rgb(0,0,0)";
    surface.context.fillRect(0, 0, width, height);
    backColorSprite.image = surface;
    return backColorSprite;
}

window.onload = () => {

    let game = new Game(960, 876);
    game.onload = function () {
        // ここに処理を書いていきます。
        var scene = new Scene();
        scene.addChild(createBackColorSprite(960, 876));
        game.pushScene(scene);
    };
    game.start();
}
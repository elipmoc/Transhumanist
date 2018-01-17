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
        let box = new Sprite(20, 20);
        let surface = new Surface(20, 20);
        surface.context.beginPath();
        surface.context.fillStyle = "rgb(0,200,200)";
        surface.context.fillRect(0, 0, 20, 20);
        box.image = surface;
        box.addEventListener("touchstart", function (e) { alert("touch"); });
        scene.addChild(box);

    };
    game.start();
}
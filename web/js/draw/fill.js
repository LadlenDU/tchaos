draw.fill = function (canvas) {
    //var surf = new canvas.surface();
    var surf = new DirectSurface(canvas);

    var width = canvas.canvas().width;
    var height = canvas.canvas().height;

    var rndCol = pic.getRandomColor();
    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            //var col = {r: 0, g: 0, b: 255, a: 255};
            surf.px(x, y, rndCol);
        }
    }

    surf.putImageData();
};

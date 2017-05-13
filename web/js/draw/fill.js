draw.fill = {
    props: function () {

    },
    run: function (canvas, props) {
        if (!props) {

        }
        //canvas.ctx().

        directDraw(canvas, function (surf, width, height) {
            var rndCol = pic.getRandomColor();
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    //var col = {r: 0, g: 0, b: 255, a: 255};
                    var rndCol = pic.getRandomColor();
                    surf.px(x, y, rndCol);
                }
            }
        });
    }
};

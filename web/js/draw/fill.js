draw.fill = {
    props: {color: []},
    run: function (canvas, width, height, props) {

        canvas.ctx().fillStyle = props.color;
        canvas.ctx().fillRect(0, 0, width - 1, height - 1);

        directDraw(canvas, function (surf) {
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

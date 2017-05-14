render.fill = {
    props: {
        color: {
            type: 'color', val: []
        }
    },
    run: function (canvas, width, height, props) {

        //props.color = {r: 0, g: 255, b: 0, a: 255};

        canvas.ctx().fillStyle = pic.colorArrToRGBA(props.color);
        canvas.ctx().fillRect(0, 0, width, height);

        /*directDraw(canvas, function (surf) {
         //var rndCol = pic.getRandomColor();
         for (var y = 0; y < height; ++y) {
         for (var x = 0; x < width; ++x) {
         //var col = {r: 0, g: 0, b: 255, a: 255};
         //var rndCol = pic.getRandomColor();
         surf.px(x, y, rndCol);
         }
         }
         });*/
    }
};

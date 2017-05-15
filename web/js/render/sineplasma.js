render.sineplasma = function () {

    this.props = {
        color: {
            type: 'color', val: []
        },
        width_div: {
            type: 'range_int', val: [1, 10]
        },
        height_div: {
            type: 'range_int', val: [1, 10]
        }
    };

    this.run = function (canvas, width, height, props) {
        directDraw(canvas, function (surf) {
            var PI_THREE_TWO = 3 / 2 * Math.PI;

            // Кружок получается из полной синус-дуги
            var $xDel = width / props.width_div;		// if(xDel < 1) xDel = 1.2;
            var $yDel = height / props.height_div;	    // if(yDel < 1) yDel = 1.2;

            var $xKoef = (Math.PI * 2) / $xDel;
            var $yKoef = (Math.PI * 2) / $yDel;

            for (var $y = 0; $y < height; ++$y) {
                for (var $x = 0; $x < width; ++$x) {
                    var $channel = Math.round(127 + 64 * Math.sin($x * $xKoef + PI_THREE_TWO) + 64 * Math.sin($y * $yKoef + PI_THREE_TWO));

                    var $colorT = props.color;
                    $colorT.a = 255 - $channel;

                    surf.px($x, $y, $colorT);
                }
            }
        });
    }
};

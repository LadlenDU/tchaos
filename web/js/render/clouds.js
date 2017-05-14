render.clouds = function () {

    var cloudsThis = this;

    this.props = {color: []};
    this.run = function (canvas, width, height, props) {
        directDraw(canvas, function (surf) {
            /*for (var y = 0; y < height; ++y) {
             for (var x = 0; x < width; ++x) {
             surf.px(x, y, rndCol);
             }
             }*/

            // props.subtype
            //$this->SubpalsmaTypeOfInterpolation = $attr['sub_prop']['subtype'];
            cloudsThis.SubpalsmaTypeOfInterpolation = 0;

            // props.depth
            var $SubplasmaDepth = 10 * 257;   //$attr['sub_prop']['depth'] * 257; // TODO: ???

            props.type = 'sineplasma';
            props.width_div = 5;    // for sineplasma
            props.height_div = 5;    // for sineplasma

            var $color = props.color;
            var $colorRes = $color;

            var $red = $color.r;
            var $green = $color.g;
            var $blue = $color.b;

            var $redBottom = $red - $SubplasmaDepth;
            if ($redBottom < 0) {
                $redBottom = 0;
            }

            var $greenBottom = $green - $SubplasmaDepth;
            if ($greenBottom < 0) {
                $greenBottom = 0;
            }

            var $blueBottom = $blue - $SubplasmaDepth;
            if ($blueBottom < 0) {
                $blueBottom = 0;
            }

            var $redDiffer = $red - $redBottom;
            var $greenDiffer = $green - $greenBottom;
            var $blueDiffer = $blue - $blueBottom;

            $color = {r: $blue, g: $green, b: $red};		// Переделка цветового формата

            var PI_THREE_TWO = 3 / 2 * Math.PI;

            if (props.type == 'sineplasma')	// Синус-плазма
            {
                // Кружок получается из полной синус-дуги
                var $xDel = width / props.width_div;		// if(xDel < 1) xDel = 1.2;
                var $yDel = height / props.sine_prop;	    // if(yDel < 1) yDel = 1.2;

                var $xKoef = (Math.PI * 2) / $xDel;
                var $yKoef = (Math.PI * 2) / $yDel;

                for (var $y = 0; $y < height; ++$y) {
                    for (var $x = 0; $x < width; ++$x) {
                        var $channel = Math.round(128 + 64 * Math.sin($x * $xKoef + PI_THREE_TWO) + 64 * Math.sin($y * $yKoef + PI_THREE_TWO));

                        var $colorT = $color;
                        $colorT.a = 255 - $channel;

                        surf.px($x, $y, $colorT);
                    }
                }
            }
            /*else if( props.type == 'subplasma' )	// Субплазма
             {
             $SubpalsmaWidthDivision = $xDiv = props.width_div;
             $SubpalsmaHeightDivision = $yDiv = props.height_div;
             if ( $attr['sub_prop']['perlin_noise'] ) {		// Создать и сложить 8 (несколько?) субплазм
             // Создадим рабочее поле для плазмы
             $imageBuffer = array_fill(0, $this->height, array_fill(0, $this->width, 0));

             $count = 4;		// Счетчик плазм
             $ResCount = array_fill(0, $this->height, array_fill(0, $this->width, 0));

             $colorMax = 0x00FFFFFF;		// Максимальное значение цвета для работы

             //	!!!!!!!!!!11     ----------- ВНИМАНИЕ !!!  Можно уменьшить кол-во складываемых плазм в Perlin Noise

             while($count--)
             {
             $this->CreatePlasm($imageBuffer, $xDiv, $yDiv, $colorMax);				// Заполнить очередную плазму
             $colorMax /= 1.5;
             for($y = 0; $y < $this->height; ++$y) {
             for($x = 0; $x < $this->width; ++$x) {
             $ResCount[$y][$x] += $imageBuffer[$y][$x];
             }
             }

             $xDiv <<= 1;	$yDiv <<= 1;		// Увеличение коэффициентов деления
             // Проверка на корректность создаваемой плазмы
             if($this->width / $xDiv < 1) break;
             if($this->height / $yDiv < 1) break;
             }
             $this->ColorImage($ResCount, $attr['sub_prop']['depth'], $colorRes);
             } else {	// Простая субплазма
             $imageBuffer = array_fill(0, $this->height, array_fill(0, $this->width, 0));
             $this->CreatePlasm($imageBuffer, $SubpalsmaWidthDivision, $SubpalsmaHeightDivision, 0x00FFFFFF);
             $this->ColorImage($imageBuffer, $attr['sub_prop']['depth'], $colorRes);		// Разукрашиваем рисунок
             }
             } else {	// Фрактальная плазма


             }*/


        });
    }
};

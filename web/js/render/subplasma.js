render.sineplasma = function () {

    var cThis = this;

    this.props = {
        color: {
            type: 'color', val: []
        },
        width_div: {
            type: 'range_int', val: [1, 10]
        },
        height_div: {
            type: 'range_int', val: [1, 10]
        },
        perlin_noise: {
            type: 'range_int', val: [0, 1]
        },
        depth: {
            type: 'range_int', val: [1, 200]
        },
        interpolation_type: {
            type: 'range_int', val: [0, 2]
        }
    };

    this.run = function (canvas, width, height, props) {

        cThis.width = width;
        cThis.height = height;
        cThis.props = props;

        directDraw(canvas, function (surf) {

            cThis.surf = surf;

            // props.subtype
            //$this->SubpalsmaTypeOfInterpolation = $attr['sub_prop']['subtype'];
            //cloudsThis.SubpalsmaTypeOfInterpolation = 0;

            // props.depth
            //var $SubplasmaDepth = 10 * 257;   //$attr['sub_prop']['depth'] * 257; // TODO: ???

            //props.type = 'sineplasma';
            //props.width_div = 5;    // for sineplasma
            //props.height_div = 5;    // for sineplasma

            //props.color = {r: 255, g: 0, b: 0, a: 255};
            /*            var $color = props.color;
             clog("r: " + props.color.r + "; g: " + props.color.g + "; b: " + props.color.b + "; a: " + props.color.a);

             //var $colorRes = $color;

             var $red = $color.r;
             var $green = $color.g;
             var $blue = $color.b;*/

            /*var $redBottom = $red - $SubplasmaDepth;
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
             }*/

            /*var $redDiffer = $red - $redBottom;
             var $greenDiffer = $green - $greenBottom;
             var $blueDiffer = $blue - $blueBottom;*/

            //$color = {r: $blue, g: $green, b: $red};		// Переделка цветового формата


            var $SubpalsmaWidthDivision = $xDiv = props.width_div;
            var $SubpalsmaHeightDivision = $yDiv = props.height_div;

            if (props.perlin_noise) {		// Создать и сложить 8 (несколько?) субплазм
                // Создадим рабочее поле для плазмы
                //$imageBuffer = array_fill(0, height, array_fill(0, width, 0));
                var $imageBuffer = new Canvas(width, height);

                var $count = 4;		// Счетчик плазм
                var $ResCount = new Canvas(width, height);

                var $colorMax = 0x00FFFFFF;		// Максимальное значение цвета для работы

                //	!!!!!!!!!!11     ----------- ВНИМАНИЕ !!!  Можно уменьшить кол-во складываемых плазм в Perlin Noise

                while ($count--) {
                    cThis.createPlasm($imageBuffer, $xDiv, $yDiv, $colorMax);				// Заполнить очередную плазму
                    $colorMax /= 1.5;
                    for (var $y = 0; $y < height; ++$y) {
                        for (var $x = 0; $x < width; ++$x) {
                            $ResCount[$y][$x] += $imageBuffer[$y][$x];
                        }
                    }

                    $xDiv <<= 1;
                    $yDiv <<= 1;		// Увеличение коэффициентов деления
                    // Проверка на корректность создаваемой плазмы
                    if (width / $xDiv < 1) break;
                    if (height / $yDiv < 1) break;
                }
                cThis.colorImage($ResCount, props.depth, $colorRes);
            } else {	// Простая субплазма
                $imageBuffer = new Canvas(width, height);
                cThis.createPlasm($imageBuffer, $SubpalsmaWidthDivision, $SubpalsmaHeightDivision, 0x00FFFFFF);
                cThis.colorImage($imageBuffer, $attr['sub_prop']['depth'], $colorRes);		// Разукрашиваем рисунок
            }

        });
    };

    /**
     * Создает плазму на заданной пов-сти с разделением на divKoefWidth и divKoefHeight
     */
    this.createPlasm = function ($surface, $divKoefWidth, $divKoefHeight, $colorMax) {
        //#double xKoefForAdding, yKoefForAdding;	// Коэффициент при делении поля

        //#UINT* colorUpGlobal = new UINT [divKoefWidth];		// Массив для верхних точек всего рисунка
        //$colorUpGlobal = array_fill(0, $divKoefWidth, 0);
        $colorUpGlobal = new Canvas(width, height);

        //#UINT* colorDownToUp = new UINT [divKoefWidth];		// Массив для нижних точек строки, что станут верхними
        $colorDownToUp = new Canvas(width, height);

        // Запоминают значение правых точек чтобы сделать их левыми
        $colorLeftToRightUp = 0;
        $colorLeftToRightDown = 0;
        //#UINT firstXUpColor, firstXDownColor;	                // Самые левые точки текущей строки для совмещения с правой стороной
        //#UINT rightUpCol, rightDownCol;			            // Цвета для интерполяции - точки правой стороны
        // Конечные цвета для интерполяции
        $endUpLeft = 0;
        $endUpRight = 0;
        $endDownLeft = 0;
        $endDownRight = 0;

        $xKoefForAdding = cThis.width / $divKoefWidth;
        $yKoefForAdding = cThis.height / $divKoefHeight;

        $y = 0;
        for ($yCount = 1; $yCount <= $divKoefHeight; $yCount++) {
            $x = 0;
            for ($xCount = 1; $xCount <= $divKoefWidth; $xCount++) {
                //#int xRealPos, yRealPos;		// Правая и нижняя координаты, подогнанные под края
                $xRealPos = Math.round($x + $xKoefForAdding); //if(xRealPos > hImg->width) xRealPos = hImg->width;
                $yRealPos = Math.round($y + $yKoefForAdding); //if(yRealPos > hImg->height) yRealPos = hImg->height;

                $endDownRight = $rightDownCol = rand(0, $colorMax);	// Правый нижний угол
                if ($yCount == 1) {	// Самая верхняя строка
                    if ($xCount == 1) {	// Случайно найдем левые углы
                        $colorLeftToRightUp = rand(0, $colorMax);
                        $colorLeftToRightDown = rand(0, $colorMax);
                    } else {	// Левым углам присвоим значения правых предыдущей фигуры
                        $colorLeftToRightUp = $endUpRight;
                    }

                    // Случайно найдем правый верхний угол
                    $rightUpCol = rand(0, $colorMax);
                    $colorUpGlobal[$xCount - 1] = $colorLeftToRightUp;	// Запоминаем значения цветов верхней линии
                    $endUpLeft = $colorLeftToRightUp;
                    $endUpRight = $rightUpCol;
                    $endDownLeft = $colorLeftToRightDown;
                } else {	// Срединная строка - для ее генерации значения верхних точек берутся из массива
                    $endUpLeft = $colorDownToUp[$xCount - 1];
                    // Последний прямоугольник по X
                    if ($xCount == $divKoefWidth) {
                        $endUpRight = $colorDownToUp[0];
                    } else {
                        $endUpRight = $colorDownToUp[$xCount];
                    }
                    $endDownLeft = $colorLeftToRightDown;
                }
                if ($xCount == 1) {	// Левая сторона строки
                    $firstXUpColor = $endUpLeft;
                    $firstXDownColor = $endDownLeft;
                }
                if ($xCount == $divKoefWidth) {	// Последний прямоугольник строки
                    $endUpRight = $firstXUpColor;
                    $endDownRight = $firstXDownColor;
                    $xRealPos = cThis.width;
                }
                if ($yCount == $divKoefHeight) {		// Обработка последнего прямоугольника по оси Y
                    $endDownLeft = $colorUpGlobal[$xCount - 1];
                    // Последний прямоугольник по X
                    if ($xCount == $divKoefWidth) {
                        $endDownRight = $colorUpGlobal[0];
                    } else {
                        $endDownRight = $colorUpGlobal[$xCount];
                    }
                    $yRealPos = cThis.height;
                }
                // Интерполяция
                cThis.interpolateYKoord($surface, Math.round($y), $yRealPos, Math.round($x), $xRealPos, $endUpLeft, $endUpRight, $endDownLeft, $endDownRight);
                $colorDownToUp[$xCount - 1] = $colorLeftToRightDown;
                $colorLeftToRightDown = $rightDownCol;
                $x += $xKoefForAdding;
            }
            $y += $yKoefForAdding;
        }
    };

    /**
     *  Интерполирует прямоугольник с заданными координатами и цветами
     */
    this.interpolateYKoord = function ($surface, $yPosUp, $yPosDown, $xPosLeft, $xPosRight, $leftUpCol, $rightUpCol, $leftDownCol, $rightDownCol) {
        if (cThis.props.interpolation_type == 0) {		// Линейная интерполяция
            //#int yStep;								// Длина сторон исследуемого прямоугольника
            //#int vertDifferLeft, vertDifferRight;	// Разница цветов по оси Y с левой стороны и с правой
            //#double vertKoefLeft, vertKoefRight;		// Коэффициент для прибавления к цвету по оси Y
            //#double leftCurrCol, rightCurrCol;		// Текуще интерполируемые цвета по обеим боковым сторонам прямоугольника
            $yStep = $yPosDown - $yPosUp;
            $vertDifferLeft = $leftDownCol - $leftUpCol;
            $vertDifferRight = $rightDownCol - $rightUpCol;
            $vertKoefLeft = $vertDifferLeft / $yStep;
            $vertKoefRight = $vertDifferRight / $yStep;
            $leftCurrCol = $leftUpCol;
            $rightCurrCol = $rightUpCol;
            while ($yPosUp < $yPosDown) {
                cThis.interpolateXKoord($surface[$yPosUp], $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                $yPosUp++;
                // Изменение интерполируемых цветов
                $leftCurrCol += $vertKoefLeft;
                $rightCurrCol += $vertKoefRight;
            }
        } else if (cThis.props.interpolation_type == 1) {	// Интерполяция 2
            //#int yStep;								    // Длина сторон исследуемого прямоугольника
            //#int vertDifferLeft, vertDifferRight;	    // Разница цветов по оси Y с левой стороны и с правой
            //#double vertKoefLeft, vertKoefRight;		// Коэффициент для прибавления к цвету по оси Y
            //#double leftCurrCol, rightCurrCol;			// Текуще интерполируемые цвета по обеим боковым сторонам прямоугольника
            $yStep = $yPosDown - $yPosUp;
            $vertDifferLeft = $leftDownCol - $leftUpCol;
            $vertDifferRight = $rightDownCol - $rightUpCol;
            $vertKoefLeft = $vertDifferLeft / $yStep;
            $vertKoefRight = $vertDifferRight / $yStep;
            $leftCurrCol = $leftUpCol;
            $rightCurrCol = $rightUpCol;
            while ($yPosUp < $yPosDown) {
                cThis.interpolateXKoord($surface[$yPosUp], $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                $yPosUp++;
                // Изменение интерполируемых цветов
                $leftCurrCol += $vertKoefLeft;
                $rightCurrCol += $vertKoefRight;
            }
        } else {	// Интерполяция 3
            $angle = 1;						// Коэффициент асинуса для интерполяции
            //#int yStep;								// Длина сторон исследуемого прямоугольника
            //#int vertDifferLeft, vertDifferRight;	// Разница цветов по оси Y с левой стороны и с правой
            //#double vertKoef;						// Коэффициент для прибавления к градусам по оси Y
            //#double leftCurrCol, rightCurrCol;		// Текуще интерполируемые цвета по обеим боковым сторонам прямоугольника
            $yStep = $yPosDown - $yPosUp;
            $vertDifferLeft = $leftDownCol - $leftUpCol;
            $vertDifferRight = $rightDownCol - $rightUpCol;
            $vertKoef = 2. / $yStep;
            $leftCurrCol = $leftUpCol;
            $rightCurrCol = $rightUpCol;
            while ($yPosUp < $yPosDown) {
                // Изменение интерполируемых цветов
                $leftCurrCol = $leftDownCol - $vertDifferLeft * ( (Math.asin($angle) + Math.PI / 2) / PI );
                $rightCurrCol = $rightDownCol - $vertDifferRight * ( (Math.asin($angle) + Math.PI / 2) / PI );
                cThis.interpolateXKoord($surface[$yPosUp], $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                $yPosUp++;
                $angle -= $vertKoef;
            }
        }
    };

    /*
     * Интерполирует на изображении от begCol до endCol, в заданных позициях
     * @param array $surfaceY полоса по оси y
     */
    this.InterpolateXKoord = function ($surfaceY, $xPosBeg, $xPosEnd, $begCol, $endCol)
    {
        //#int * hImgY = hImg->imageBuffer + yPos * hImg->width;	// Указатель для ускорения
        if(cThis.props.interpolation_type == 0){		// Линейная интерполяция
            $xStep = $xPosEnd - $xPosBeg;
            $differency = $endCol - $begCol;	// Разница между цветами
            $koef = $differency / $xStep;		// Коэффициент для прибавления
            $begColTemp = $begCol;		        // Дробный аналог begCol
            while($xPosBeg < $xPosEnd){
            //#*($hImgY + $xPosBeg) = (int)$begColTemp;
                $surfaceY[$xPosBeg] = Math.round($begColTemp);
                $xPosBeg++;
                $begColTemp += $koef;
            }
        } else if(cThis.props.interpolation_type == 1){	// Интерполяция 2
            $angle = 1.5707963268;			        // Градусы для интерполяции
            $xStep = $xPosEnd - $xPosBeg;			// Кол-во пикселей для интерполяции (+1 для неполного завершения)
            $differency = $endCol - $begCol;	    // Разница между цветами
            $koef = 3.14159265359 / $xStep;	        // Коэффициент для прибавления к градусам
            //#double begColTemp;						// Дробный аналог begCol
            while($xPosBeg < $xPosEnd){
                $begColTemp = $endCol - $differency * ( (Math.sin($angle) + 1) / 2 );
                //#*(hImgY + xPosBeg) = (int)begColTemp;
                $surfaceY[$xPosBeg] = Math.round($begColTemp);
                $xPosBeg++;
                $angle += $koef;
            }
        } else {	// Интерполяция 3
            $angle = 1;						        // Коэффициент асинуса для интерполяции
            $xStep = $xPosEnd - $xPosBeg;			// Кол-во пикселей для интерполяции (+1 для неполного завершения)
            $differency = $endCol - $begCol;	    // Разница между цветами
            $koef = 2. / $xStep;				    // Коэффициент для прибавления к коэффициенту асинуса
            //#double begColTemp;						// Дробный аналог begCol
            while($xPosBeg < $xPosEnd){
                $begColTemp = $endCol - $differency * ( (Math.asin($angle) + Math.PI / 2) / PI );
                //#*(hImgY + xPosBeg) = (int)begColTemp;
                $surfaceY[$xPosBeg] = Math.asin($begColTemp);
                $xPosBeg++;
                $angle -= $koef;
            }
        }
    };

    /*
     * Разукрасим полученное изображение
     * @param array $surface - массив типа array([y] => array([x]))
     */
    this.colorImage = function ($surface, $SubplasmaDepth, $colorRes)
    {
        // Найдем самую высокую и нижнюю точку
        $minVer = 0xFFFFFFFF;
        $maxVer = 0;
        //#$count = $this->width * $this->height;
        //#int* hTemp = hImg->imageBuffer;
        foreach($surface as $row)
        {
            foreach($row as $color) {
            if($minVer > $color) $minVer = $color;
            if($maxVer < $color) $maxVer = $color;
        }
        }
        /*while($count--){
         UINT color;
         color = *hTemp++;
         if(minVer > color) minVer = color;
         if(maxVer < color) maxVer = color;
         }*/

        $differ = $maxVer - $minVer;
        $koef = AlphaQuantumRange - $SubplasmaDepth;
        $multiplier = AlphaQuantumRange - $koef;
        //#$incChannel = QuantumRange / 255;

        // Раскрасим рисунок
        for($y = 0; $y < cThis.height; ++$y)
        {
            for($x = 0; $x < cThis.width; ++$x)
            {
                $channel = (int)(($surface[$y][$x] - $minVer) / $differ * $multiplier + $koef);	// Относительное положение цвета
                //#$colorRes['alpha'] = (AlphaQuantumRange - $channel) * $incChannel;
                $colorRes['alpha'] = AlphaQuantumRange - $channel;
                //Color::putColorToImage($this->image, $x, $y, $colorRes);
                cThis.surf.px($x, $y, $colorRes);
            }
        }
    };
};

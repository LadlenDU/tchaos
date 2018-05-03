render.subplasma = function () {

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

            var $xDiv = props.width_div;
            //var $SubpalsmaWidthDivision = $xDiv;
            var $yDiv = props.height_div;
            //var $SubpalsmaHeightDivision = $yDiv;

            //if (props.perlin_noise) {		// Создать и сложить 8 (несколько?) субплазм
            if (0) {
                // Создадим рабочее поле для плазмы
                //$imageBuffer = array_fill(0, height, array_fill(0, width, 0));
                clog("width: " + width + "; height: " + height);
                var $imageBuffer = helper.surfaceArrayFill(width, height);

                var $count = 4;		// Счетчик плазм
                var $ResCount = helper.surfaceArrayFill(width, height);

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
                cThis.colorImage($ResCount, props.depth, props.color);
            } else {	// Простая субплазма
                $imageBuffer = helper.surfaceArrayFill(width, height);
                //cThis.createPlasm($imageBuffer, $SubpalsmaWidthDivision, $SubpalsmaHeightDivision, 0x00FFFFFF);
                cThis.createPlasm($imageBuffer, $xDiv, $yDiv, 0x00FFFFFF);
                helper.surfaceArrayToDirectSurface($imageBuffer, cThis.surf);
                //clog("props.depth: " + props.depth + "; props.color: " + props.color);
                //cThis.colorImage($imageBuffer, props.depth, props.color);		// Разукрашиваем рисунок
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
        var $colorUpGlobal = helper.surfaceArrayFill(cThis.width, cThis.height);

        //#UINT* colorDownToUp = new UINT [divKoefWidth];		// Массив для нижних точек строки, что станут верхними
        var $colorDownToUp = helper.surfaceArrayFill(cThis.width, cThis.height);

        // Запоминают значение правых точек чтобы сделать их левыми
        var $colorLeftToRightUp = 0;
        var $colorLeftToRightDown = 0;
        //#UINT firstXUpColor, firstXDownColor;	                // Самые левые точки текущей строки для совмещения с правой стороной
        //#UINT rightUpCol, rightDownCol;			            // Цвета для интерполяции - точки правой стороны
        // Конечные цвета для интерполяции
        var $endUpLeft = 0;
        var $endUpRight = 0;
        var $endDownLeft = 0;
        var $endDownRight = 0;

        var $xKoefForAdding = cThis.width / $divKoefWidth;
        var $yKoefForAdding = cThis.height / $divKoefHeight;

        var $y = 0;
        for (var $yCount = 1; $yCount <= $divKoefHeight; $yCount++) {
            var $x = 0;
            for (var $xCount = 1; $xCount <= $divKoefWidth; $xCount++) {
                //#int xRealPos, yRealPos;		// Правая и нижняя координаты, подогнанные под края
                var $xRealPos = Math.round($x + $xKoefForAdding); //if(xRealPos > hImg->width) xRealPos = hImg->width;
                var $yRealPos = Math.round($y + $yKoefForAdding); //if(yRealPos > hImg->height) yRealPos = hImg->height;

                // Правый нижний угол
                var $rightDownCol = props_r.range_int(0, $colorMax);
                $endDownRight = $rightDownCol;
                if ($yCount == 1) {	// Самая верхняя строка
                    if ($xCount == 1) {	// Случайно найдем левые углы
                        $colorLeftToRightUp = props_r.range_int(0, $colorMax);
                        $colorLeftToRightDown = props_r.range_int(0, $colorMax);
                    } else {	// Левым углам присвоим значения правых предыдущей фигуры
                        $colorLeftToRightUp = $endUpRight;
                    }

                    // Случайно найдем правый верхний угол
                    var $rightUpCol = props_r.range_int(0, $colorMax);
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
                    var $firstXUpColor = $endUpLeft;
                    var $firstXDownColor = $endDownLeft;
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
                //InterpolateYKoord(        hImg,         (int)y,  yRealPos,         (int)x,  xRealPos,  endUpLeft,  endUpRight,  endDownLeft,  endDownRight);
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
            var $yStep = $yPosDown - $yPosUp;
            var $vertDifferLeft = $leftDownCol - $leftUpCol;
            var $vertDifferRight = $rightDownCol - $rightUpCol;
            var $vertKoefLeft = $vertDifferLeft / $yStep;
            var $vertKoefRight = $vertDifferRight / $yStep;
            var $leftCurrCol = $leftUpCol;
            var $rightCurrCol = $rightUpCol;
            while ($yPosUp < $yPosDown) {
                cThis.interpolateXKoord($surface[$yPosUp], $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                //cThis.interpolateXKoord($surface, $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
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
                //cThis.interpolateXKoord($surface, $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                $yPosUp++;
                // Изменение интерполируемых цветов
                $leftCurrCol += $vertKoefLeft;
                $rightCurrCol += $vertKoefRight;
            }
        } else {	// Интерполяция 3
            var $angle = 1;						// Коэффициент асинуса для интерполяции
            //#int yStep;								// Длина сторон исследуемого прямоугольника
            //#int vertDifferLeft, vertDifferRight;	// Разница цветов по оси Y с левой стороны и с правой
            //#double vertKoef;						// Коэффициент для прибавления к градусам по оси Y
            //#double leftCurrCol, rightCurrCol;		// Текуще интерполируемые цвета по обеим боковым сторонам прямоугольника
            $yStep = $yPosDown - $yPosUp;
            $vertDifferLeft = $leftDownCol - $leftUpCol;
            $vertDifferRight = $rightDownCol - $rightUpCol;
            var $vertKoef = 2. / $yStep;
            $leftCurrCol = $leftUpCol;
            $rightCurrCol = $rightUpCol;
            while ($yPosUp < $yPosDown) {
                // Изменение интерполируемых цветов
                $leftCurrCol = $leftDownCol - $vertDifferLeft * ( (Math.asin($angle) + Math.PI / 2) / Math.PI );
                $rightCurrCol = $rightDownCol - $vertDifferRight * ( (Math.asin($angle) + Math.PI / 2) / Math.PI );
                cThis.interpolateXKoord($surface[$yPosUp], $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                //cThis.interpolateXKoord($surface, $xPosLeft, $xPosRight, Math.round($leftCurrCol), Math.round($rightCurrCol));
                $yPosUp++;
                $angle -= $vertKoef;
            }
        }
    };

    /*
     * Интерполирует на изображении от begCol до endCol, в заданных позициях
     * @param array $surfaceY полоса по оси y
     */
    this.interpolateXKoord = function ($surfaceY, $xPosBeg, $xPosEnd, $begCol, $endCol) {
        //#int * hImgY = hImg->imageBuffer + yPos * hImg->width;	// Указатель для ускорения
        if (cThis.props.interpolation_type == 0) {		// Линейная интерполяция
            var $xStep = $xPosEnd - $xPosBeg;
            var $differency = $endCol - $begCol;	// Разница между цветами
            var $koef = $differency / $xStep;		// Коэффициент для прибавления
            var $begColTemp = $begCol;		        // Дробный аналог begCol
            while ($xPosBeg < $xPosEnd) {
                //#*($hImgY + $xPosBeg) = (int)$begColTemp;
                $surfaceY[$xPosBeg] = Math.round($begColTemp);
                $xPosBeg++;
                $begColTemp += $koef;
            }
        } else if (cThis.props.interpolation_type == 1) {	// Интерполяция 2
            var $angle = 1.5707963268;			        // Градусы для интерполяции
            $xStep = $xPosEnd - $xPosBeg;			// Кол-во пикселей для интерполяции (+1 для неполного завершения)
            $differency = $endCol - $begCol;	    // Разница между цветами
            $koef = 3.14159265359 / $xStep;	        // Коэффициент для прибавления к градусам
            //#double begColTemp;						// Дробный аналог begCol
            while ($xPosBeg < $xPosEnd) {
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
            while ($xPosBeg < $xPosEnd) {
                $begColTemp = $endCol - $differency * ( (Math.asin($angle) + Math.PI / 2) / Math.PI );
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
    this.colorImage = function ($surface, $SubplasmaDepth, $colorRes) {
        // Найдем самую высокую и нижнюю точку
        var $minVer = 0xFFFFFFFF;
        var $maxVer = 0;
        //#$count = $this->width * $this->height;
        //#int* hTemp = hImg->imageBuffer;

        /*for(var i in $surface) {
         if($minVer > $surface[i]) {
         $minVer = $surface[i];
         }
         if($maxVer < $surface[i]) {
         $maxVer = $surface[i];
         }
         }*/

        //this.surf.getData();

        for (var i in $surface) {
            var $row = $surface[i];
            for (var j in $row) {
                var $color = $row[j];
                if ($minVer > $color) {
                    $minVer = $color;
                }
                if ($maxVer < $color) {
                    $maxVer = $color;
                }
            }
        }

        var $differ = $maxVer - $minVer;
        var $koef = 255 - $SubplasmaDepth;
        var $multiplier = 255 - $koef;
        //#$incChannel = QuantumRange / 255;

        // Раскрасим рисунок
        for (var $y = 0; $y < cThis.height; ++$y) {
            for (var $x = 0; $x < cThis.width; ++$x) {
                var $channel = Math.round((($surface[$y][$x] - $minVer) / $differ * $multiplier + $koef));	// Относительное положение цвета
                //#$colorRes['alpha'] = (255 - $channel) * $incChannel;
                $colorRes.a = 255 - $channel;
                //Color::putColorToImage($this->image, $x, $y, $colorRes);
                cThis.surf.px($x, $y, $colorRes);
            }
        }
    };
};

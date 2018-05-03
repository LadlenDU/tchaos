render.fractal_line = function () {

    this.props = {
        /*color: {
            type: 'color', val: []
        },*/
        closed: {
            type: 'range_int', val: [0, 1]
        },
        fractalLineSectors: {
            type: 'range_int_between', val: [1, 50]
        },
        fractalLineLength: {
            type: 'range_int_between', val: [1, 50]
        },
        fractalLineBendFactor: {
            type: 'range_int_between', val: [1, 50]
        },
        fractalLineThickness: {
            type: 'range_int_between', val: [1, 10]
        }
    };

    this.run = function (canvas, width, height, props) {

        // Коорд. начальной
        props.prototype.xBeg = props_r.range_int(0, width - 1);
        props.prototype.yBeg = props_r.range_int(0, height - 1);

        directDraw(canvas, function (surf) {

            var xEnd, yEnd;		// Коорд. конечной точки

            if (props.closed) {
                var numOfSectors;			// Кол-во секторов, пересекаемых фрактальной линией
                var xSect = {val:null}, ySect = {val:null};			// Смещение в секторах по X и Y
                //numOfSectors = (int)(GetRandom() * (MaxFractalLineSectors - MinFractalLineSectors)) + MinFractalLineSectors;
                numOfSectors = props_r.range_int(fractalLineSectors.min, fractalLineSectors.max);
                // Найдем, по какой из координат будет максимальное значение
                var pointX, pointY;		    // Ссылки на объекты
                if(props_r.range_int(0, 1)) {
                    pointX = xSect;
                    pointY = ySect;
                } else  {
                    pointX = ySect;
                    pointY = xSect;
                }
                pointX.val = numOfSectors;
                if(props_r.range_int(0, 1)) {
                    pointX.val = -pointX.val;
                }
                pointY.val = props_r.range_int(-numOfSectors - 1, numOfSectors + 1);
                if(props_r.range_int(0, 1)) {
                    pointY.val = -pointY.val;
                }
                // Найдем непосредственно конечные координаты фр-ой прямой
                xEnd = props.xBeg + xSect.val * width;
                yEnd = props.yBeg + ySect.val * height;
            } else {
                var angle;					// Угол поворота оси фрактальной прямой
                var xKat, yKat;					// Длины катетов для нахождения второй коорд. прямой по углу
                var lengthOfLine;				// Длина линии

                angle = props_r.range_int(0, Math.PI * 2);    //GetRandom() * PI_TWO;
                lengthOfLine = (int)(GetRandom() * (MaxFractalLineLength - MinFractalLineLength)) + MinFractalLineLength;
                xKat = (int)(lengthOfLine * cos(angle));
                yKat = (int)(lengthOfLine * sin(angle));
                // Найдем фактические коорд. конечных точек новых катетов
                xEnd = xKat + xBeg;
                yEnd = yKat + yBeg;
            }
        });
    }
};

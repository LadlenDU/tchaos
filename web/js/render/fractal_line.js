render.fractal_line = function () {

    this.props = {
        /*color: {
            type: 'color', val: []
        },*/
        closed: {
            type: 'range_int', val: [1, 0]
        },
        MinFractalLineSectors: {
            type: 'range_int', val: [1, 50]
        },
        MaxFractalLineSectors: {
            type: 'range_int', val: [1, 50]
        },
        MinFractalLineLength: {
            type: 'range_int', val: [1, 50]
        },
        MaxFractalLineLength: {
            type: 'range_int', val: [1, 50]
        },
        MinFractalLineBendFactor: {
            type: 'range_int', val: [1, 50]
        },
        MaxFractalLineBendFactor: {
            type: 'range_int', val: [1, 50]
        },
        MinFractalLineThickness: {
            type: 'range_int', val: [1, 10]
        },
        MaxFractalLineThickness: {
            type: 'range_int', val: [1, 30]
        }
    };

    this.run = function (canvas, width, height, props) {

        props.prototype.xBeg = props_r.range_int(0, width - 1);
        props.prototype.yBeg = props_r.range_int(0, height - 1);

        directDraw(canvas, function (surf) {
            if (props.closed) {
                var numOfSectors;			// Кол-во секторов, пересекаемых фрактальной линией
                var xSect, ySect;			// Смещение в секторах по X и Y
                numOfSectors = (int)(GetRandom() * (MaxFractalLineSectors - MinFractalLineSectors)) + MinFractalLineSectors;
                // Найдем, по какой из координат будет максимальное значение
                var pointX, pointY;		    // Ссылка на число
                if(props_r.range_int(0, 1)) {
                    pointX = xSect;
                    pointY = ySect;
                } else  {
                    pointX = ySect;
                    pointY = xSect;
                }
                *pointX = numOfSectors;
                if(GetRandom() < .5) *pointX = -(*pointX);
                //*pointY = (int)(GetRandom() * numOfSectors) + 1;
            *pointY = (int)GetRandomIn(-numOfSectors - 1, numOfSectors + 1);
                if(GetRandom() < .5) *pointY = -(*pointY);

                // Найдем непосредственно конечные координаты фр-ой прямой
                xEnd = xBeg + xSect * width;
                yEnd = yBeg + ySect * height;
            }
        });
    }
};

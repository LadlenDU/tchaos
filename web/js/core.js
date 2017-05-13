var draw = {};
var filter = {};

function Canvas(width, height) {

    var canvasThis = this;

    this._canvas = document.createElement('canvas');
    this._canvas.width = width;
    this._canvas.height = height;
    clog("_canvas.width = " + this._canvas.width + "; _canvas.height = " + this._canvas.height);

    this._ctx = this._canvas.getContext('2d');

    this.toDataURL = function () {
        return canvasThis._canvas.toDataURL();
    };

    this.canvas = function () {
        return canvasThis._canvas;
    };

    this.ctx = function () {
        return canvasThis._ctx;
    };
}

function DirectSurface(canvas) {
    var imageData = canvas.ctx().getImageData(0, 0, canvas.canvas().width, canvas.canvas().height);
    var data = imageData.data;
    clog("data.length = " + data.length);

    var wWidth = 4 * canvas.canvas().width;

    this.px = function (x, y, col) {
        var pos = y * wWidth + x * 4;
        //clog("x=" + x + "; y=" + y + "; pos=" + pos);
        data[pos] = col.r;
        data[pos + 1] = col.g;
        data[pos + 2] = col.b;
        data[pos + 3] = col.a;
    };

    this.putImageData = function () {
        canvas.ctx().putImageData(imageData, 0, 0);
    };
}

function directDraw(canvas, func) {
    var surf = new DirectSurface(canvas);

    //var width = canvas.canvas().width;
    //var height = canvas.canvas().height;

    func(surf); //, width, height);

    surf.putImageData();
}

function prepareProperties(obj) {
    var readyProps = {};

    for (var prop in obj) {
        //props_r[prop].apply(null, obj[prop]);
        readyProps[prop] = props_r[prop].apply(props_r, obj[prop]);

    }

    return readyProps;
}

var pic = {
    colorArrToRGBA: function (arr) {
        return "rgba(" + arr.r + "," + arr.g + "," + arr.b + "," + (arr.a / 255) + ")";
    },
    //TODO: obsolete
    getRandomChannel: function (min, max) {
        if (!min) {
            min = 0;
        }
        if (!max) {
            max = 256;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    },
    //TODO: obsolete
    getRandomColor: function (min, max) {
        return {
            r: this.getRandomChannel(min, max),
            g: this.getRandomChannel(min, max),
            b: this.getRandomChannel(min, max),
            a: this.getRandomChannel(min, max)
        };
    }
};

var props_r = {
    // If max is not set or min == max then this is not a range but a regular number equal min.
    range_int: function (min, max) {
        if ((!max && max !== 0) || min == max) {
            return min;
        }
        if (max < min) {
            clog("MAX " + max + " less than MIN " + min);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    color: function (r, g, b) {
        var col = {};

        if (!r && r !== 0) {
            col.r = this.range_int(0, 255);
        } else {
            if (Array.isArray(r)) {
                col.r = this.range_int(r.min, r.max);
            } else {
                col.r = r;
            }
        }

        if (!g && g !== 0) {
            col.g = this.range_int(0, 255);
        } else {
            if (Array.isArray(g)) {
                col.g = this.range_int(g.min, g.max);
            } else {
                col.g = g;
            }
        }

        if (!b && b !== 0) {
            col.b = this.range_int(0, 255);
        } else {
            if (Array.isArray(b)) {
                col.b = this.range_int(b.min, b.max);
            } else {
                col.b = b;
            }
        }

        col.a = 255;

        return col;
    },
    color_tr: function (r, g, b, a) {
        var col = this.color(r, g, b);

        if (!a && a !== 0) {
            col.a = this.range_int(0, 255);
        } else {
            if (Array.isArray(a)) {
                col.a = this.range_int(a.min, a.max);
            } else {
                col.a = a;
            }
        }

        return col;
    }
};
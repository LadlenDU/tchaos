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

function DirectSurface(width, height) {

    DirectSurface.superclass.constructor.call(this, width, height);

    var imageData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
    var data = imageData.data;
    clog("data.length = " + data.length);

    var wWidth = 4 * this._canvas.width;

    this.px = function (x, y, col) {
        var pos = y * wWidth + x * 4;
        //clog("x=" + x + "; y=" + y + "; pos=" + pos);
        data[pos] = col.r;
        data[pos + 1] = col.g;
        data[pos + 2] = col.b;
        data[pos + 3] = col.a;
    };

    this.putImageData = function () {
        this._ctx.putImageData(imageData, 0, 0);
    };
}

/*function Surface(width, height) {

    DirectSurface.superclass.constructor.call(this, width, height);

    var surfaceThis = this;

    this.ctx = function () {
        return surfaceThis._ctx;
    }
}*/

helper.extend(DirectSurface, Canvas);
//helper.extend(Surface, Canvas);

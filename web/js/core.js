function Surface(width, height) {

    //var canvas = document.getElementById(element);
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    clog("canvas.width2=" + canvas.width + "; canvas.height2=" + canvas.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    clog("data.length: " + data.length);

    this.px = function (x, y, col) {
        var pos = y * 4 * canvas.width + x * 4;
        //clog("x=" + x + "; y=" + y + "; pos=" + pos);
        data[pos] = col.r;
        data[pos + 1] = col.g;
        data[pos + 2] = col.b;
        data[pos + 3] = col.a;
    };

    this.putImageData = function () {
        ctx.putImageData(imageData, 0, 0);
    };

    this.toDataURL = function () {
        return canvas.toDataURL();
    }
}

function Surface(element, width, height) {

    var canvas = document.getElementById(element);
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    clog("canvas.width2=" + canvas.width + "; canvas.height2=" + canvas.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    console.log("data.length" + data.length);

    this.px = function (x, y, col) {
        var pos = y * 4 * canvas.width + x * 4;
        //console.log("x=" + x + "; y=" + y + "; pos=" + pos);
        data[pos] = col.r;
        data[pos + 1] = col.g;
        data[pos + 2] = col.b;
        data[pos + 3] = col.a;
    };

    this.show = function () {
        ctx.putImageData(imageData, 0, 0);
    };


    /*var id = ctx.createImageData(1, 1);
     var d = id.data;

     this.px = function (x, y, col) {
     //var id = myContext.createImageData(1, 1);    // only do this once per page
     //var d = id.data;                           // only do this once per page
     d[0] = col.r;
     d[1] = col.g;
     d[2] = col.b;
     d[3] = col.a;
     ctx.putImageData(id, x, y);
     }*/
}

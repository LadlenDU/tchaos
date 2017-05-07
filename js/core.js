function surface(element, width, height) {

    var canvas = document.getElementById(element),
        ctx = canvas.getContext('2d');

    var id = ctx.createImageData(1, 1);
    var d = id.data;

    var px = function (x, y, col) {
        //var id = myContext.createImageData(1, 1);    // only do this once per page
        //var d = id.data;                           // only do this once per page
        d[0] = col.r;
        d[1] = col.g;
        d[2] = col.b;
        d[3] = col.a;
        ctx.putImageData(id, x, y);
    }
}


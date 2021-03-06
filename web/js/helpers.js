function clog(text) {
    if (window.console) {
        window.console.log(text);
    }
}

var helper = {};

helper.extend = function (Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
};

helper.surfaceArrayFill = function (width, height) {
    //return [].fill([].fill(0, 0, width - 1), 0, height - 1);

    var row = [].fill.call({length: width}, 0);
    //return [].fill.call({length: height}, row);

    var arr = [];
    for (var i = 0; i < height; ++i) {
        arr.push(row);
    }
    return arr;
};

helper.surfaceArrayToDirectSurface = function (surfaceArray, directSurface) {
    if (!surfaceArray.length) {
        return;
    }
    var width = surfaceArray[0].length;
    var height = surfaceArray.length;
    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            directSurface.px(x, y, pic.integerToColor(surfaceArray[y][x]));
        }
    }
};

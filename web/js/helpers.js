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
    return [].fill([].fill(0, 0, width - 1), 0, height - 1);
};

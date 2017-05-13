function clog(text) {
    if (window.console) {
        window.console.log(text);
    }
}

var pic = {
    getRandomChannel: function (min, max) {
        if (!min) {
            min = 0;
        }
        if (!max) {
            max = 256;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomColor: function (min, max) {
        return {
            r: this.getRandomChannel(min, max),
            g: this.getRandomChannel(min, max),
            b: this.getRandomChannel(min, max),
            a: this.getRandomChannel(min, max)
        };
    }
};


var helper = {};

helper.extend = function (Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
};

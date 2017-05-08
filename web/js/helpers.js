function clog(text) {
    if (window.console) {
        window.console.log(text);
    }
}

function getRandomChannel(min, max) {
    if (!min) {
        min = 0;
    }
    if (!max) {
        max = 256;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

var pic = {
    getRandomColor: function (min, max) {
        return {
            r: getRandomChannel(min, max),
            g: getRandomChannel(min, max),
            b: getRandomChannel(min, max),
            a: getRandomChannel(min, max)
        };
    }
};

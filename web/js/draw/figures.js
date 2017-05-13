draw.figures = function (canvas) {
    var ctx = canvas.ctx();
    ctx.beginPath();
    ctx.moveTo(75, 20);
    ctx.lineTo(100, 85);
    ctx.lineTo(100, 25);
    ctx.fill();
};

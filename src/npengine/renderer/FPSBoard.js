FPSBoard = function() {
    this.then = new Date;
    this.count = 0;
    this.fps = 0;
};

// constructor
FPSBoard.prototype.constructor = CanvasRenderer;



FPSBoard.prototype.update = function() {
    this.count++;
};

FPSBoard.prototype.render = function(context) {
    var now = new Date;
    var delta = now - this.then;

    if (this.count%100 == 0) {
        this.fps = Number((1000/delta).toFixed(1));
    }
    context.font="20px Arial";
    context.fillText("fps: " + this.fps, 0, 22);
    this.then = now;
};
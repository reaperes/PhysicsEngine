NPEngine.FPSBoard = function() {
    this.visible = true;
    this.then = new Date;
    this.count = 0;
    this.fps = 0;
};

// constructor
NPEngine.FPSBoard.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.FPSBoard.prototype.update = function() {
    this.count++;
};

NPEngine.FPSBoard.prototype.render = function(context) {
    var now = new Date;
    var delta = now - this.then;

    if (this.count%100 == 0) {
        this.fps = Number((1000/delta).toFixed(1));
    }

    if (this.visible == true) {
        context.font="20px Arial";
        context.fillText("fps: " + this.fps, 0, 46);
    }
    this.then = now;
};
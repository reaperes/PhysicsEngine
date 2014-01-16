FPSBoard = function() {
    this.renderCount = 0;
};

// constructor
FPSBoard.prototype.constructor = CanvasRenderer;



FPSBoard.prototype.update = function() {
    this.renderCount++;
};

FPSBoard.prototype.render = function(context) {
    context.fillText(this.renderCount, 0, 10)
};
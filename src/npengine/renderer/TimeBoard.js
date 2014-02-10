NPEngine.TimeBoard = function () {
  this.visible = true;
  this.init();
};

// constructor
NPEngine.TimeBoard.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.TimeBoard.prototype.init = function () {
  this.then = new Date().getTime();
}

NPEngine.TimeBoard.prototype.update = function () {
};

NPEngine.TimeBoard.prototype.render = function (context) {
  if (this.visible == false) {
    return ;
  }

  var now = new Date().getTime();
  var delta = now - this.then;
  var timeFormat = NPEngine.Convert.toTimeFormat(delta);

  if (this.visible == true) {
    context.font = "20px Arial";
    context.fillText("Time: " + timeFormat, 0, 22);
  }
};
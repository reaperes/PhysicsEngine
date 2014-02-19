NPEngine.TimeBoard = function () {
  this.visible = true;
  this.init();
};

// constructor
NPEngine.TimeBoard.prototype.constructor = NPEngine.TimeBoard;



NPEngine.TimeBoard.prototype.init = function () {
  this.timeFormat = "00:00:00";
  this.sumOfTime = undefined;
};

NPEngine.TimeBoard.prototype.resume = function () {
  if (this.sumOfTime === undefined) {
    this.then = new Date().getTime();
  }
  else {
    this.then = new Date().getTime() - this.sumOfTime;
  }
};

NPEngine.TimeBoard.prototype.pause = function () {
  this.sumOfTime = new Date().getTime() - this.then;
};

NPEngine.TimeBoard.prototype.update = function () {
  var now = new Date().getTime();
  var delta = now - this.then;
  this.timeFormat = NPEngine.Convert.toTimeFormat(delta);
};

NPEngine.TimeBoard.prototype.render = function (context) {
  if (this.visible == false) {
    return ;
  }

  if (this.visible == true) {
    context.font = "20px Arial";
    context.fillText("Time: " + this.timeFormat, 0, 22);
  }
};
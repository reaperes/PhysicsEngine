NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.deltaTime = 0.01;
  this.ball1 = new NPEngine.Point;
  this.ball2 = new NPEngine.Point;
  this.diameter1 = 0.1;
  this.diameter2 = 0.1;
  this.velocityX1 = 1;
  this.velocityY1 = 0;
  this.velocityX2 = 0;
  this.velocityY2 = 0;
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.ball1.x = -1;
  this.ball1.y = 1;
  this.ball2.x = 1;
  this.ball2.y = 0;
};

NPEngine.Collision2d.prototype.onStart = function() {
  this.startTime = new Date().getTime();
};

NPEngine.Collision2d.prototype.onStop = function() {
};

NPEngine.Collision2d.prototype.compute = function () {
  this.memory = [];
  var ball1_x = this.ball1.x;
  var ball1_y = this.ball1.y;
  var ball2_x = this.ball2.x;
  var ball2_y = this.ball2.y;

  for (var i=0; i<10000; i++) {
    ball1_x = ball1_x+this.velocityX1*this.deltaTime;
    ball1_y = ball1_y+this.velocityY1*this.deltaTime;
    ball2_x = ball2_x+this.velocityX2*this.deltaTime;
    ball2_y = ball2_y+this.velocityY2*this.deltaTime;
    this.memory.push({time: i, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});
  }
};

NPEngine.Collision2d.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime*1000)); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.ball1.x = data.ball1_x;
  this.ball1.y = data.ball1_y;
  this.ball2.x = data.ball2_x;
  this.ball2.y = data.ball2_y;
};

NPEngine.Collision2d.prototype.render = function (context) {
  var convertedBall1 = this.grid.convertToGridPoint(this.ball1);
  var convertedBall2 = this.grid.convertToGridPoint(this.ball2);
  var convertedDiameter1 = this.grid.convertToGridValue(this.diameter1);
  var convertedDiameter2 = this.grid.convertToGridValue(this.diameter2);

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(convertedBall1.x, convertedBall1.y, convertedDiameter1, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(convertedBall2.x, convertedBall2.y, convertedDiameter2, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
};

NPEngine.Collision2d.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};
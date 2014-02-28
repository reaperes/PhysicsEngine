NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.deltaTime = 0.001;  //second
  this.ball1 = new NPEngine.Point(-1, 1);
  this.ball2 = new NPEngine.Point(1, 0);
  this.curBall1 = new NPEngine.Point;
  this.curBall2 = new NPEngine.Point;
  this.mass1 = 2;         // kg
  this.mass2 = 2;
  this.diameter1 = 1;   // m
  this.diameter2 = 1;
  this.velocity1_x = 1;    // m/s
  this.velocity1_y = 0;
  this.velocity2_x = 0;
  this.velocity2_y = 0;
  this.k = 10000;         // N/m
  this.mu = 50;           // N s/m
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
};

NPEngine.Collision2d.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Collision2d.prototype.compute = function () {
  this.memory = [];
  var ball1_x = this.ball1.x;
  var ball1_y = this.ball1.y;
  var ball2_x = this.ball2.x;
  var ball2_y = this.ball2.y;
  var sumOfDiameter = this.diameter1 + this.diameter2;
  this.memory.push({time: 0, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});

  var velocity1_x = this.velocity1_x;
  var velocity1_y = this.velocity1_y;
  var velocity2_x = this.velocity2_x;
  var velocity2_y = this.velocity2_y;
  var forceX1;
  var forceY1;

  for (var i=1; i<10000; i++) {
    var distanceOfBall = Math.sqrt(Math.pow((ball1_x-ball2_x),2)+Math.pow((ball1_y-ball2_y),2));
    if (distanceOfBall <= sumOfDiameter) {
      forceX1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_x-ball2_x)/distanceOfBall-this.mu*(velocity1_x-velocity2_x);
      forceY1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_y-ball2_y)/distanceOfBall-this.mu*(velocity1_y-velocity2_y);
      velocity1_x = velocity1_x + forceX1/this.mass1*this.deltaTime;
      velocity1_y = velocity1_y + forceY1/this.mass1*this.deltaTime;
      velocity2_x = velocity2_x - forceX1/this.mass2*this.deltaTime;
      velocity2_y = velocity2_y - forceY1/this.mass2*this.deltaTime;
    }

    ball1_x = ball1_x+velocity1_x*this.deltaTime;
    ball1_y = ball1_y+velocity1_y*this.deltaTime;
    ball2_x = ball2_x+velocity2_x*this.deltaTime;
    ball2_y = ball2_y+velocity2_y*this.deltaTime;
    this.memory.push({time: i, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});
  }
};

NPEngine.Collision2d.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall1.x = this.grid.convertToVectorValueX(data.ball1_x);
  this.curBall1.y = this.grid.convertToVectorValueY(data.ball1_y);
  this.curBall2.x = this.grid.convertToVectorValueX(data.ball2_x);
  this.curBall2.y = this.grid.convertToVectorValueY(data.ball2_y);
  this.curBallDiameter1 = this.grid.convertToGridScalaValue(this.diameter1);
  this.curBallDiameter2 = this.grid.convertToGridScalaValue(this.diameter2);
};

NPEngine.Collision2d.prototype.onStart = function() {
};

NPEngine.Collision2d.prototype.onResume = function() {
};

NPEngine.Collision2d.prototype.onPause = function() {
};

NPEngine.Collision2d.prototype.onStop = function() {
};

NPEngine.Collision2d.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/1); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    this.curBall1.x = this.grid.convertToVectorValueX(data.ball1_x);
    this.curBall1.y = this.grid.convertToVectorValueY(data.ball1_y);
    this.curBall2.x = this.grid.convertToVectorValueX(data.ball2_x);
    this.curBall2.y = this.grid.convertToVectorValueY(data.ball2_y);
  }
};

NPEngine.Collision2d.prototype.render = function (context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall1.x, this.curBall1.y, this.curBallDiameter1, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall2.x, this.curBall2.y, this.curBallDiameter2, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
};

NPEngine.Collision2d.prototype.setMass1 = function(value) {
  this.mass1 = value;
};

NPEngine.Collision2d.prototype.setMass2 = function(value) {
  this.mass2 = value;
};

NPEngine.Collision2d.prototype.setK = function(value) {
  this.k = value;
};

NPEngine.Collision2d.prototype.setMu = function(value) {
  this.mu = value;
};

NPEngine.Collision2d.prototype.setDiameter1 = function(value) {
  this.diameter1 = value;
};

NPEngine.Collision2d.prototype.setDiameter2 = function(value) {
  this.diameter2 = value;
};

NPEngine.Collision2d.prototype.setBall1_x = function(value) {
  this.ball1.x = value;
};

NPEngine.Collision2d.prototype.setBall1_y = function(value) {
  this.ball1.y = value;
};

NPEngine.Collision2d.prototype.setBall2_x = function(value) {
  this.ball2.x = value;
};

NPEngine.Collision2d.prototype.setBall2_y = function(value) {
  this.ball2.y = value;
};

NPEngine.Collision2d.prototype.setVelocity1_x = function(value) {
  this.velocity1_x = value;
};

NPEngine.Collision2d.prototype.setVelocity1_y = function(value) {
  this.velocity1_y = value;
};

NPEngine.Collision2d.prototype.setVelocity2_x = function(value) {
  this.velocity2_x = value;
};

NPEngine.Collision2d.prototype.setVelocity2_y = function(value) {
  this.velocity2_y = value;
};
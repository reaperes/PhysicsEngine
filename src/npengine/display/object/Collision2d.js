NPEngine.Collision2d = function (options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  this.deltaTime = 0.001;  //second

  // initial variables
  this.k = options.k !== undefined ? options.k : 10000;             // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;              // N s/m
  this.mass1 = options.mass1 !== undefined ? options.mass1 : 2;     // kg
  this.mass2 = options.mass2 !== undefined ? options.mass2 : 2;     // kg

  var ball1X = options.ball1X !== undefined ? options.ball1X : -3;  // m
  var ball1Y = options.ball1Y !== undefined ? options.ball1Y : 0.5; // m
  this.diameter1 = options.diameter1 !== undefined ? options.diameter1 : 0.4;         // m
  this.velocity1_x = options.velocity1_x !== undefined ? options.velocity1_x : 3;     // m/s
  this.velocity1_y = options.velocity1_y !== undefined ? options.velocity1_y : 0;     // m/s

  var ball2X = options.ball2X !== undefined ? options.ball2X : 1;  // m
  var ball2Y = options.ball2Y !== undefined ? options.ball2Y : 0; // m
  this.diameter2 = options.diameter2 !== undefined ? options.diameter2 : 0.4;         // m
  this.velocity2_x = options.velocity2_x !== undefined ? options.velocity2_x : 0;     // m/s
  this.velocity2_y = options.velocity2_y !== undefined ? options.velocity2_y : 0;     // m/s

  // other variables
  this.ball1 = new NPEngine.Point(ball1X, ball1Y);
  this.ball2 = new NPEngine.Point(ball2X, ball2Y);
  this.curBall1 = new NPEngine.Point;
  this.curBall2 = new NPEngine.Point;
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
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
    var ball1_x = this.grid.convertToVectorValueX(data.ball1_x);
    var ball1_y = this.grid.convertToVectorValueY(data.ball1_y);
    var ball2_x = this.grid.convertToVectorValueX(data.ball2_x);
    var ball2_y = this.grid.convertToVectorValueY(data.ball2_y);

    // boundary check
    if (ball1_x < 0 || ball1_x > this.viewWidth || ball1_y < 0 || ball1_y > this.viewheight || ball2_x < 0 || ball2_x > this.viewWidth || ball2_y < 0 || ball2_y > this.viewHeight) {
      return ;
    }
    this.curBall1.x = ball1_x;
    this.curBall1.y = ball1_y;
    this.curBall2.x = ball2_x;
    this.curBall2.y = ball2_y;
  }
};

NPEngine.Collision2d.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.beginPath();
  context.arc(this.curBall1.x, this.curBall1.y, this.curBallDiameter1, 0, 2*Math.PI, true);
  context.fillStyle = fill;
  context.fill();
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.curBall2.x, this.curBall2.y, this.curBallDiameter2, 0, 2*Math.PI, true);
  context.fillStyle = fill;
  context.fill();
  context.stroke();
  context.closePath();

  context.beginPath();
  context.font = '34pt Calibri';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = text;
  context.fillText('1', this.curBall1.x, this.curBall1.y);
  context.fillText('2', this.curBall2.x, this.curBall2.y);
  context.closePath();
};

NPEngine.Collision2d.prototype.setVariables = function (options) {
  options = options || {};

  // initial variables
  this.k = options.k !== undefined ? options.k : 10000;             // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;              // N s/m
  this.mass1 = options.mass1 !== undefined ? options.mass1 : 2;     // kg
  this.mass2 = options.mass2 !== undefined ? options.mass2 : 2;     // kg

  var ball1X = options.ball1X !== undefined ? options.ball1X : -3;  // m
  var ball1Y = options.ball1Y !== undefined ? options.ball1Y : 0.5; // m
  this.diameter1 = options.diameter1 !== undefined ? options.diameter1 : 0.4;         // m
  this.velocity1_x = options.velocity1_x !== undefined ? options.velocity1_x : 3;     // m/s
  this.velocity1_y = options.velocity1_y !== undefined ? options.velocity1_y : 0;     // m/s

  var ball2X = options.ball2X !== undefined ? options.ball2X : 1;  // m
  var ball2Y = options.ball2Y !== undefined ? options.ball2Y : 0; // m
  this.diameter2 = options.diameter2 !== undefined ? options.diameter2 : 0.4;         // m
  this.velocity2_x = options.velocity2_x !== undefined ? options.velocity2_x : 0;     // m/s
  this.velocity2_y = options.velocity2_y !== undefined ? options.velocity2_y : 0;     // m/s

  // other variables
  this.ball1 = new NPEngine.Point(ball1X, ball1Y);
  this.ball2 = new NPEngine.Point(ball2X, ball2Y);
};
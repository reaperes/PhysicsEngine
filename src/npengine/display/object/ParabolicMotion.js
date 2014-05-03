NPEngine.ParabolicMotion = function(options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  // final variables
  this.deltaTime  = 0.01;        // second

  // initial variables
  this.gravity = options.gravity !== undefined ? options.gravity : 9.8;   // m/s^2
  this.mu = options.mu !== undefined ? options.mu : 0;                    // friction constant
  this.mass = options.mass !== undefined ? options.mass : 1;              // kg
  this.theta = options.theta !== undefined ? NPEngine.Convert.toRadians(options.theta) : 0.785398;   // rad
  this.velocity = options.velocity !== undefined ? options.velocity : 60;                            // m/s

  // initial positions
  this.ball = new NPEngine.Point(0, 0);

  // moving position
  this.curBall = new NPEngine.Point;
};

NPEngine.ParabolicMotion.prototype.constructor = NPEngine.ParabolicMotion;
NPEngine.ParabolicMotion.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.ParabolicMotion.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.ParabolicMotion.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.ParabolicMotion.prototype.compute = function () {
  this.trace = [];
  this.memory = [];
  var ballX = this.ball.x;
  var ballY = this.ball.y;
  var velocityX = this.velocity*Math.cos(this.theta);
  var velocityY = this.velocity*Math.sin(this.theta);
  var forceX = -this.mu*velocityX;
  var forceY = -this.mu*velocityY - this.mass*this.gravity;
  this.memory.push({
    time: 0,
    ballX: ballX,
    ballY: ballY
  });

  for (var i=1; i<10000; i++) {
    ballX = ballX+this.deltaTime*velocityX;
    ballY = ballY+this.deltaTime*velocityY;
    velocityX = velocityX+forceX/this.mass*this.deltaTime;
    velocityY = velocityY+forceY/this.mass*this.deltaTime;
    forceX = -this.mu*velocityX;
    forceY = -this.mu*velocityY - this.mass*this.gravity;
    this.memory.push({
      time: i,
      ballX: ballX,
      ballY: ballY
    })
  }
};

NPEngine.ParabolicMotion.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
};

NPEngine.ParabolicMotion.prototype.onStart = function() {
};

NPEngine.ParabolicMotion.prototype.onResume = function() {
};

NPEngine.ParabolicMotion.prototype.onPause = function() {
};

NPEngine.ParabolicMotion.prototype.onStop = function() {
};

NPEngine.ParabolicMotion.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime*1000)); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    var ballX = this.grid.convertToVectorValueX(data.ballX);
    var ballY = this.grid.convertToVectorValueY(data.ballY);

    // boundary check
    if (ballY > this.grid.convertToVectorValueY(0)) {
      return ;
    }
    this.curBall.x = ballX;
    this.curBall.y = ballY;

    // trace line
    this.trace.push({
      x: ballX,
      y: ballY
    });
  }
};

NPEngine.ParabolicMotion.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.strokeStyle = stroke;
  context.fillStyle = fill;

  // draw trace
  context.beginPath();
  context.moveTo(this.grid.convertToVectorValueX(0), this.grid.convertToVectorValueY(0));
  context.lineWidth = 1;
  for (var i=0; i<this.trace.length; i++) {
    context.lineTo(this.trace[i].x, this.trace[i].y);
  }
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.curBall.x, this.curBall.y, 10, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
  context.closePath();
};

NPEngine.ParabolicMotion.prototype.setVariables = function (options) {
  options = options || {};

  // initial variables
  this.gravity = options.gravity !== undefined ? options.gravity : 9.8;   // m/s^2
  this.mu = options.mu !== undefined ? options.mu : 0;                    // friction constant
  this.mass = options.mass !== undefined ? options.mass : 1;              // kg
  this.theta = options.theta !== undefined ? NPEngine.Convert.toRadians(options.theta) : 0.785398;   // rad
  this.velocity = options.velocity !== undefined ? options.velocity : 60;                            // m/s
};

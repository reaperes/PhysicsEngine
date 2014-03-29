NPEngine.ParabolicMotion = function() {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.deltaTime  = 0.01;        // second

  // initial variables
  this.gravity    = 9.8;        // m/s^2
  this.mass       = 1;          // kg
  this.theta      = 0.785398;   // rad
  this.velocity   = 70;         // m/s
  this.mu         = 0.1;        // friction constant

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
    if (ballY > this.viewHeight) {
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
  // draw trace
  context.beginPath();
  context.moveTo(this.grid.convertToVectorValueX(0), this.grid.convertToVectorValueY(0));
  context.lineWidth = 1;
  for (var i=0; i<this.trace.length; i++) {
    context.lineTo(this.trace[i].x, this.trace[i].y);
  }
  context.stroke();

  context.beginPath();
  context.arc(this.curBall.x, this.curBall.y, 10, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.ParabolicMotion.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.ParabolicMotion.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.ParabolicMotion.prototype.setAngle = function (value) {
  this.theta = NPEngine.Convert.toRadians(value);
};

NPEngine.ParabolicMotion.prototype.setVelocity = function (value) {
  this.velocity = value;   // m/s
};
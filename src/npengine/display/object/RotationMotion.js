NPEngine.RotationMotion = function(options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  this.deltaTime = 0.0002;

  this.k = options.k !== undefined ? options.k : 200000;            // N/m

  this.ballMass = options.ballMass !== undefined ? options.ballMass : 1.1;          // kg
  this.ballRadius = options.ballRadius !== undefined ? options.ballRadius : 0.1;    // m
  var ballVelocity = options.ballVelocity !== undefined ? options.ballVelocity : 3; // m/s

  this.blockMass = options.blockMass !== undefined ? options.blockMass : 15;        // kg
  this.blockWidth = options.blockWidth !== undefined ? options.blockWidth : 0.3;    // m
  this.blockHeight = options.blockHeight !== undefined ? options.blockHeight : 1;   // m

  this.gravity = 9.8;  // m/s^2

  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block = new NPEngine.Point(0, this.blockHeight);
  this.blockCollisionPoint = new NPEngine.Point(this.blockWidth, this.blockHeight);
  this.ball = new NPEngine.Point(3, this.blockHeight);
  this.ballVelocityX = -ballVelocity;   // m/s
  this.ballVelocityY = 0;               // m/s

  this.curBall = this.ball.clone();
  this.curBlock = this.block.clone();
};

NPEngine.RotationMotion.prototype.constructor = NPEngine.RotationMotion;
NPEngine.RotationMotion.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.RotationMotion.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.RotationMotion.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.RotationMotion.prototype.compute = function () {
  this.memory = [];

  var ball = this.ball.clone();
  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;

  var theta = -this.theta0;
  var angularVelocity = 0;
  var collisionPoint = this.blockCollisionPoint.clone();
  var distance = Math.sqrt((ball.x-collisionPoint.x)*(ball.x-collisionPoint.x)+(ball.y-collisionPoint.y)*(ball.y-collisionPoint.y));
  var forceX = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(collisionPoint.x-ball.x)/distance : 0;
  var forceY = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(collisionPoint.y-ball.y)/distance : 0;
  var torque = collisionPoint.x*forceY-collisionPoint.y*forceX + (theta>-this.theta0 ? 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) : 0);

  this.memory.push({
    ballX: ball.x,
    ballY: ball.y,
    theta: -(theta+this.theta0)
  });

  var radian90 = NPEngine.Convert.toRadians(90)-this.theta0;
  var count = 1;
  var flag = 0.01/this.deltaTime;
  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    ballVelocityX = ballVelocityX - forceX / this.ballMass * this.deltaTime;
    ballVelocityY = ballVelocityY - forceY / this.ballMass * this.deltaTime;
    ball.x = ball.x + ballVelocityX * this.deltaTime;
    ball.y = ball.y + ballVelocityY * this.deltaTime;

    angularVelocity = (theta < -this.theta0 || theta > radian90) ? 0 : angularVelocity + torque / this.momentOfInertia * this.deltaTime;
    theta = theta + angularVelocity * this.deltaTime;
    collisionPoint.x = this.blockDiagonalHeight*Math.sin(-theta);
    collisionPoint.y = this.blockDiagonalHeight*Math.cos(theta);
    distance = Math.sqrt((ball.x - collisionPoint.x) * (ball.x - collisionPoint.x) + (ball.y - collisionPoint.y) * (ball.y - collisionPoint.y));
    forceX = distance < this.ballRadius ? this.k * (this.ballRadius - distance) * (collisionPoint.x - ball.x) / distance : 0;
    forceY = distance < this.ballRadius ? this.k * (this.ballRadius - distance) * (collisionPoint.y - ball.y) / distance : 0;
    torque = collisionPoint.x * forceY - collisionPoint.y * forceX + (theta > -this.theta0 ? 0.5 * this.blockMass * this.gravity * this.blockDiagonalHeight * Math.sin(theta) : 0);

    if (count == flag) {
      this.memory.push({
        ballX: ball.x,
        ballY: ball.y,
        theta: -(theta+this.theta0)
    });
      count = 1;
    }
    else {
      count++;
    }
  }
};

NPEngine.RotationMotion.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;

  this.curBlock.x = this.grid.convertToVectorValueX(this.block.x);
  this.curBlock.y = this.grid.convertToVectorValueY(this.block.y);
  this.convertedBallRadius = this.grid.convertToGridScalaValue(this.ballRadius);
  this.convertedBlockWidth = this.grid.convertToGridScalaValue(this.blockWidth);
  this.convertedBlockHeight = this.grid.convertToGridScalaValue(this.blockHeight);
};

NPEngine.RotationMotion.prototype.onStart = function() {
};

NPEngine.RotationMotion.prototype.onResume = function() {
};

NPEngine.RotationMotion.prototype.onPause = function() {
};

NPEngine.RotationMotion.prototype.onStop = function() {
};

NPEngine.RotationMotion.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;
};

NPEngine.RotationMotion.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.fillStyle = fill;
  context.strokeStyle = stroke;

  context.beginPath();
  context.arc(this.curBall.x, this.curBall.y, this.convertedBallRadius, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
  context.closePath();

  context.save();
  context.beginPath();
  context.translate(this.grid.centerWidth, this.grid.centerHeight);
  context.rotate(this.curTheta);
  context.translate(-this.grid.centerWidth, -this.grid.centerHeight);
  context.fillRect(this.curBlock.x, this.curBlock.y, this.convertedBlockWidth, this.convertedBlockHeight);
  context.stroke();
  context.closePath();
  context.restore();
};

NPEngine.RotationMotion.prototype.setVariables = function (options) {

  options = options || {};

  this.k = options.k !== undefined ? options.k : 200000;            // N/m

  this.ballMass = options.ballMass !== undefined ? options.ballMass : 1.1;          // kg
  this.ballRadius = options.ballRadius !== undefined ? options.ballRadius : 0.1;    // m
  var ballVelocity = options.ballVelocity !== undefined ? options.ballVelocity : 3; // m/s

  this.blockMass = options.blockMass !== undefined ? options.blockMass : 15;        // kg
  this.blockWidth = options.blockWidth !== undefined ? options.blockWidth : 0.3;    // m
  this.blockHeight = options.blockHeight !== undefined ? options.blockHeight : 1;   // m

  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block = new NPEngine.Point(0, this.blockHeight);
  this.blockCollisionPoint = new NPEngine.Point(this.blockWidth, this.blockHeight);
  this.ball = new NPEngine.Point(3, this.blockHeight);
  this.ballVelocityX = -ballVelocity;   // m/s

  this.curBall = this.ball.clone();
  this.curBlock = this.block.clone();
};
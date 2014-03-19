NPEngine.RotationMotion = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.0002

  this.ballMass = 0.4;        // kg
  this.gravity = 9.8;         // m/s^2
  this.blockMass = 10;        // kg
  this.k = 200000;            // N/m

  this.ballRadius = 0.1;
  this.blockWidth = 0.3;
  this.blockHeight = 0.5;
  this.blockDiagonalHeight = Math.sqrt(this.ballRadius*this.ballRadius+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);

  this.blockUpperRightPoint = new NPEngine.Point(this.blockWidth, this.blockHeight);
  this.ball = new NPEngine.Point(1.5, 0.5);
  this.ballVelocityX = -3;
  this.ballVelocityY = 0;

  this.curBall = new NPEngine.Point;
  this.curBlockUpperLeft = new NPEngine.Point(0, this.blockHeight);
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
  var angularVelocity = 0;
  var blockUpperRight = this.blockUpperRightPoint.clone();
//  var theta = Math.asin((-blockUpperRight.x)/this.blockDiagonalHeight)+this.theta0;
  var theta = 0;
  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;
  var distance = Math.sqrt((ball.x-blockUpperRight.x)*(ball.x-blockUpperRight.x)+(ball.y-blockUpperRight.y)*(ball.y-blockUpperRight.y));
  var forceX = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(blockUpperRight.x-ball.x)/distance : 0;
  var forceY = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(blockUpperRight.y-ball.y)/distance : 0;
  var torqueUndefined = theta>0 ? -0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(this.theta0-theta) : 0;
  var torque = blockUpperRight.x*forceY-blockUpperRight.y*forceX + torqueUndefined;
  this.memory.push({
    ballX: ball.x,
    ballY: ball.y,
    theta: theta
  });

  var radian90 = NPEngine.Convert.toRadians(90);
  var count = 1;
  var flag = 0.01/this.deltaTime;
  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    angularVelocity = (theta<0) || (theta>radian90) ? 0 : angularVelocity+torque/this.momentOfInertia*this.deltaTime;
    theta = theta + angularVelocity*this.deltaTime;
    blockUpperRight.x = this.blockDiagonalHeight*Math.sin(this.theta0-theta);
    blockUpperRight.y = this.blockDiagonalHeight*Math.cos(this.theta0-theta);
    ballVelocityX = ballVelocityX - forceX/this.ballMass*this.deltaTime;
    ballVelocityY = ballVelocityY - forceY/this.ballMass*this.deltaTime;
    ball.x = ball.x+ballVelocityX*this.deltaTime;
    ball.y = ball.y+ballVelocityY*this.deltaTime;
    distance = Math.sqrt((ball.x-blockUpperRight.x)*(ball.x-blockUpperRight.x)+(ball.y-blockUpperRight.y)*(ball.y-blockUpperRight.y));
    forceX = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(blockUpperRight.x-ball.x)/distance : 0;
    forceY = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(blockUpperRight.y-ball.y)/distance : 0;
    torqueUndefined = theta>0 ? -0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(this.theta0-theta) : 0;
    torque = blockUpperRight.x*forceY-blockUpperRight.y*forceX + torqueUndefined;

    if (count == flag) {
      this.memory.push({
        ballX: ball.x,
        ballY: ball.y,
        theta: theta
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
  this.curBlockUpperLeft.x = this.grid.convertToVectorValueX(this.curBlockUpperLeft.x);
  this.curBlockUpperLeft.y = this.grid.convertToVectorValueY(this.curBlockUpperLeft.y);
  this.convertedBallRadius = this.grid.convertToGridScalaValue(this.ballRadius);
  this.convertedBlockWidth = this.grid.convertToGridScalaValue(this.blockWidth);
  this.convertedBlockHeight = this.grid.convertToGridScalaValue(this.blockHeight);
  this.curTheta = data.theta;
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
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall.x, this.curBall.y, this.convertedBallRadius, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.translate(this.grid.centerWidth, this.grid.centerHeight);
  context.rotate(-this.curTheta*2);
//  context.rotate(-NPEngine.Convert.toRadians(30));
  context.translate(-this.grid.centerWidth, -this.grid.centerHeight);
  context.fillRect(this.curBlockUpperLeft.x, this.curBlockUpperLeft.y, this.convertedBlockWidth, this.convertedBlockHeight);
  context.stroke();
  context.restore();
};

NPEngine.RotationMotionPlus = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.0005;

  this.ballMass = 1.2;        // kg
  this.gravity = 9.8;         // m/s^2
  this.blockMass = 50;        // kg
  this.k = 1000000;           // N/m

  this.ballRadius = 0.1;      // m
  this.blockWidth = 0.3;      // m
  this.blockHeight = 2;       // m
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);

  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.ballX = 8;             // m
  this.ballY = 0.1;           // m

  this.incidenceAngle = NPEngine.Convert.toRadians(40);     // rad
  this.incidenceVelocity = 10;                              // m/s
  this.ballVelocityX = -this.incidenceVelocity * Math.cos(this.incidenceAngle);
  this.ballVelocityY = this.incidenceVelocity * Math.sin(this.incidenceAngle);

  this.coefficientOfFrictionBall = 300;         // N s/m
  this.coefficientOfFrictionBlock = 2000;       // N s/m

  // Graphic variables
  this.block = new NPEngine.Point(0, this.blockHeight);
  this.curBall = new NPEngine.Point(this.ballX, this.ballY);
  this.curBlock = this.block.clone();
};

NPEngine.RotationMotionPlus.prototype.constructor = NPEngine.RotationMotionPlus;
NPEngine.RotationMotionPlus.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.RotationMotionPlus.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.RotationMotionPlus.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.RotationMotionPlus.prototype.compute = function () {
  this.memory = [];

  var theta = -this.theta0;

  var blockCollisionX = this.blockDiagonalHeight*Math.sin(-theta);
  var blockCollisionY = this.blockDiagonalHeight*Math.cos(theta);

  var blockEndX = this.blockDiagonalHeight*Math.sin(-theta);
  var blockEndY = this.blockDiagonalHeight*Math.cos(theta);

  var ballX = this.ballX;
  var ballY = this.ballY;

  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;

  var angularVelocity = 0;
  var distance = Math.sqrt((ballX-blockCollisionX)*(ballX-blockCollisionX) + (ballY-blockCollisionY)*(ballY-blockCollisionY));

  var flagBallBlock = Math.abs(ballX-blockCollisionX)<this.ballRadius && ballY<this.blockHeight && ballY>0 ? 1 : 0;
  var flagBlockGround = blockEndY < 0 ? 1 : 0;
  var flagBlockGravity = theta > -this.theta0 ? 1 : 0;
  var flagBallGround = ballY < this.ballRadius ? 1: 0;

  var forceBallBlockX = this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flagBallBlock;
  var forceBallBlockY = this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flagBallBlock;
  var forceGroundBlockX = 0;
  var forceGroundBlockY = (-this.k*blockEndY+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity)*flagBlockGround;
  var forceGravityBlockX = 0;
  var forceGravityBlockY = -this.blockMass*this.gravity*flagBlockGravity;
  var forceGroundGravityBallX = this.coefficientOfFrictionBall*ballVelocityX*flagBallGround;
  var forceGroundGravityBallY = (this.k*(this.ballRadius-ballY)-this.coefficientOfFrictionBall*ballVelocityY)*flagBallGround-this.ballMass*this.gravity;

  var torque = blockCollisionX*forceBallBlockY-blockCollisionY*forceBallBlockX + -this.blockHeight*forceGroundBlockY + 0.5*(blockEndX*forceGravityBlockY-blockEndY*forceGravityBlockX);

  var forceBallX = -forceBallBlockX + forceGroundGravityBallX;
  var forceBallY = -forceBallBlockY + forceGroundGravityBallY;


  var ele = document.getElementById("output");
  var data = ele.innerHTML;
  data = data + "\n"+blockCollisionX+","+blockCollisionY+","+blockEndX+","+blockEndY+","+ballX+","+ballY+","+theta+","+ballVelocityX+","+ballVelocityY+","+angularVelocity+","+distance
    +","+forceBallBlockX+","+forceBallBlockY+","+forceGroundBlockX+","+forceGroundBlockY+","+forceGravityBlockX
    +","+forceGravityBlockY+","+forceGroundGravityBallX+","+forceGroundGravityBallY+","+flagBallBlock+","+flagBlockGround+","+flagBlockGravity+","+flagBallGround+","+torque+","+forceBallX+","+forceBallY;
  this.memory.push({
    ballX: ballX,
    ballY: ballY,
    theta: theta
  });

  var nhk = 2;
  var count = 1;
  var countFlag = 0.01/this.deltaTime;
  for (var i= 2, max=(1/this.deltaTime)*100; i<max; i++) {
    blockCollisionX = this.blockDiagonalHeight*Math.sin(-theta);

    ballVelocityY = ballVelocityY + forceBallY/this.ballMass*this.deltaTime;

    ballY = ballY + ballVelocityY*this.deltaTime;

    flagBallBlock = Math.abs(ballX-blockCollisionX)<this.ballRadius && ballY<this.blockHeight && ballY>0 ? 1 : 0;

    blockCollisionY = flagBallBlock == 1 ? ballY : blockCollisionY;

    blockEndX = this.blockDiagonalHeight*Math.sin(-theta);
    blockEndY = this.blockDiagonalHeight*Math.cos(theta);

    ballVelocityX = ballVelocityX + forceBallX/this.ballMass*this.deltaTime;

    ballX = ballX + ballVelocityX*this.deltaTime;

    angularVelocity = theta < -this.theta0 ? 0 : angularVelocity + torque/this.momentOfInertia*this.deltaTime;

    theta = theta + angularVelocity*this.deltaTime;

    distance = Math.sqrt((ballX-blockCollisionX)*(ballX-blockCollisionX) + (ballY-blockCollisionY)*(ballY-blockCollisionY));

    flagBlockGround = theta > Math.PI/2 ? 1 : 0;
    flagBlockGravity = theta > -this.theta0 ? 1 : 0;
    flagBallGround = ballY < this.ballRadius ? 1 : 0;

    forceBallBlockX = this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flagBallBlock;
    forceBallBlockY = this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flagBallBlock;
    forceGroundBlockX = 0;
    forceGroundBlockY = (-this.k*blockEndY+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity)*flagBlockGround;
    forceGravityBlockX = 0;
    forceGravityBlockY = -this.blockMass*this.gravity*flagBlockGravity;
    forceGroundGravityBallX = this.coefficientOfFrictionBall*ballVelocityX*flagBallGround;
    forceGroundGravityBallY = (this.k*(this.ballRadius-ballY)-this.coefficientOfFrictionBall*ballVelocityY)*flagBallGround-this.ballMass*this.gravity;

    torque = blockCollisionX*forceBallBlockY-blockCollisionY*forceBallBlockX + -this.blockHeight*forceGroundBlockY + 0.5*(blockEndX*forceGravityBlockY-blockEndY*forceGravityBlockX);

    forceBallX = -forceBallBlockX + forceGroundGravityBallX;
    forceBallY = -forceBallBlockY + forceGroundGravityBallY;

    if (nhk == 1986) {
      debugger;
    }

//  if (nhk == 1984) {
//    debugger;
//    alert(blockCollisionX*forceBlockY-blockCollisionY*forceBlockX);
//  }

    data = data + "\n"+blockCollisionX+","+blockCollisionY+","+blockEndX+","+blockEndY+","+ballX+","+ballY+","+theta+","+ballVelocityX+","+ballVelocityY+","+angularVelocity+","+distance
      +","+forceBallBlockX+","+forceBallBlockY+","+forceGroundBlockX+","+forceGroundBlockY+","+forceGravityBlockX
      +","+forceGravityBlockY+","+forceGroundGravityBallX+","+forceGroundGravityBallY+","+flagBallBlock+","+flagBlockGround+","+flagBlockGravity+","+flagBallGround+","+torque+","+forceBallX+","+forceBallY;

    nhk++;
    if (count == countFlag) {
      this.memory.push({
        ballX: ballX,
        ballY: ballY,
        theta: theta
      });
      count = 1;
    }
    else {
      count++;
    }
  }
//  ele.innerHTML = data;
};

NPEngine.RotationMotionPlus.prototype.onReady = function() {
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

NPEngine.RotationMotionPlus.prototype.onStart = function() {
};

NPEngine.RotationMotionPlus.prototype.onResume = function() {
};

NPEngine.RotationMotionPlus.prototype.onPause = function() {
};

NPEngine.RotationMotionPlus.prototype.onStop = function() {
};

NPEngine.RotationMotionPlus.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;
};

NPEngine.RotationMotionPlus.prototype.render = function (context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall.x, this.curBall.y, this.convertedBallRadius, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.translate(this.grid.centerWidth, this.grid.centerHeight);
  context.rotate(this.curTheta);
  context.translate(-this.grid.centerWidth, -this.grid.centerHeight);
  context.fillRect(this.curBlock.x, this.curBlock.y, this.convertedBlockWidth, this.convertedBlockHeight);
  context.stroke();
  context.restore();
};

NPEngine.RotationMotionPlus.prototype.setBallMass = function(value) {
  this.ballMass = value;
};

NPEngine.RotationMotionPlus.prototype.setBlockMass = function(value) {
  this.blockMass = value;
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
};

NPEngine.RotationMotionPlus.prototype.setK = function(value) {
  this.k = value;
};

NPEngine.RotationMotionPlus.prototype.setBallRadius = function(value) {
  this.ballRadius = value;
};

NPEngine.RotationMotionPlus.prototype.setBlockWidth = function(value) {
  this.blockWidth = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도
  this.blockCollisionPoint.x = this.blockWidth;
};

NPEngine.RotationMotionPlus.prototype.setBlockHeight = function(value) {
  this.blockHeight = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block.y = this.blockHeight;
  this.blockCollisionPoint.y = this.blockHeight;
  this.ball.y = this.blockHeight;
};

NPEngine.RotationMotionPlus.prototype.setBallX = function(value) {
  this.ball.x = value;
};

NPEngine.RotationMotionPlus.prototype.setBallV = function(value) {
  this.ballVelocityX = value;
};
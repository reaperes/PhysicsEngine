NPEngine.RotationMotionPlus = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.0005;

  this.ballMass = 1.1;        // kg
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
  alert (this.ballVelocityX + ", " + this.ballVelocityY);
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

  var radian90 = NPEngine.Convert.toRadians(90)-this.theta0;

  var theta = -this.theta0;
  var blockCollisionX = this.blockDiagonalHeight*Math.sin(-theta);
  var blockCollisionY = this.blockDiagonalHeight*Math.cos(theta);

  var blockEndX = -this.blockDiagonalHeight*Math.sin(theta);
  var blockEndY = this.blockDiagonalHeight*Math.cos(theta);

  var ballX = this.ballX;
  var ballY = this.ballY;

  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;

  var angularVelocity = 0;
  var distance = Math.sqrt((ballX-blockCollisionX)*(ballX-blockCollisionX) + (ballY-blockCollisionY)*(ballY-blockCollisionY));

  var flag = (Math.abs(ballX-blockCollisionX)<this.ballRadius && ballY<=this.blockHeight && ballY>0) ? 1 : 0;
  var ballFlag = ballY < this.ballRadius ? 1 : 0;
  var blockFlag = theta > radian90 ? 1 : 0;

  var forceBlockX = this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (this.k*this.blockHeight*(theta-radian90)*Math.cos(theta)+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity*Math.cos(theta))*blockFlag;
  var forceBlockY = this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag + (this.k*this.blockHeight*(theta-radian90)*Math.sin(theta)+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity*Math.sin(theta))*blockFlag;

  var torqueFlag = theta > -this.theta0 ? 1 : 0;
  var torque = (blockCollisionX*forceBlockY-blockCollisionY*forceBlockX) + 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) * torqueFlag;

  var forceBallX = -this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (-this.coefficientOfFrictionBall*ballVelocityX*ballFlag);
  var forceBallY = -this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag - this.ballMass*this.gravity + (-this.k*(ballY-this.ballRadius)-this.coefficientOfFrictionBall*ballVelocityY)*ballFlag;

  this.memory.push({
    ballX: ballX,
    ballY: ballY,
//    theta: -(theta+this.theta0)
    theta: theta
  });

  var nhk = 1;
  var ele = document.getElementById("output");
  var count = 1;
  var countFlag = 0.01/this.deltaTime;
  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    angularVelocity = theta < -this.theta0 ? 0 : angularVelocity + torque / this.momentOfInertia * this.deltaTime;

    theta = theta + angularVelocity * this.deltaTime;
    blockCollisionX = this.blockDiagonalHeight * Math.sin(-theta);

    ballX = ballX + ballVelocityX * this.deltaTime;
    ballY = ballY + ballVelocityY * this.deltaTime;
    flag = (Math.abs(ballX - blockCollisionX) < this.ballRadius && ballY < this.blockHeight && ballY > 0) ? 1 : 0;
    blockCollisionY = flag == 1 ? ballY : blockCollisionY;

    blockEndX = -this.blockDiagonalHeight * Math.sin(theta);
    blockEndY = this.blockDiagonalHeight * Math.cos(theta);

    ballVelocityX = ballVelocityX + forceBallX / this.ballMass * this.deltaTime;
    ballVelocityY = ballVelocityY + forceBallY / this.ballMass * this.deltaTime;

    distance = Math.sqrt((ballX - blockCollisionX) * (ballX - blockCollisionX) + (ballY - blockCollisionY) * (ballY - blockCollisionY));

    ballFlag = ballY < this.ballRadius ? 1 : 0;
    blockFlag = theta > Math.PI/2 ? 1 : 0;

    forceBlockX = this.k * (this.ballRadius - distance) * (blockCollisionX - ballX) / distance * flag + (this.k * this.blockHeight * (theta - Math.PI/2) * Math.cos(theta) + this.coefficientOfFrictionBlock * this.blockHeight * angularVelocity * Math.cos(theta)) * blockFlag;
    forceBlockY = this.k * (this.ballRadius - distance) * (blockCollisionY - ballY) / distance * flag + (this.k * this.blockHeight * (theta - Math.PI/2) * Math.sin(theta) + this.coefficientOfFrictionBlock * this.blockHeight * angularVelocity * Math.sin(theta)) * blockFlag;

    torqueFlag = theta > -this.theta0 ? 1 : 0;
    torque = (blockCollisionX*forceBlockY-blockCollisionY*forceBlockX) + 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) * torqueFlag;
  if (nhk == 1984) {
    debugger;
    alert(blockCollisionX*forceBlockY-blockCollisionY*forceBlockX);
  }
    forceBallX = -this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (-this.coefficientOfFrictionBall*ballVelocityX*ballFlag);
    forceBallY = -this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag - this.ballMass*this.gravity + (-this.k*(ballY-this.ballRadius)-this.coefficientOfFrictionBall*ballVelocityY)*ballFlag;
////    debugger;
//    if ( nhk >= 2000 && nhk < 3000) {
//      var namhoon = ele.innerHTML;
//      ele.innerHTML = namhoon + "\n" + blockCollisionX + "," + blockCollisionY + "," + ballX + "," + ballY + "," + theta + "," + ballVelocityX + "," + ballVelocityY + "," + angularVelocity + "," + distance + "," + flag + "," + forceBlockX + "," + forceBlockY + "," + torque + "," + forceBallX + "," + forceBallY + "," + ballFlag + "," + blockFlag;
//    }
    nhk++;
    if (count == countFlag) {
      this.memory.push({
        ballX: ballX,
        ballY: ballY,
//        theta: -(theta+this.theta0)
        theta: theta
      });
      count = 1;
    }
    else {
      count++;
    }
  }
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
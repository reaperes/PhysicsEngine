NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.deltaTime = 0.001;  //second
  this.ball1 = new NPEngine.Point(-3, -3);
  this.ball2 = new NPEngine.Point(1, 0);
  this.mass1 = 2;         // kg
  this.mass2 = 2;
  this.diameter1 = 0.5;   // m
  this.diameter2 = 0.5;
  this.velocityX1 = 3;    // m/s
  this.velocityY1 = 1.5;
  this.velocityX2 = 0;
  this.velocityY2 = 0;
  this.k = 10000;         // N/m
  this.mu = 50;           // N s/m
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
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
  var sumOfDiameter = this.diameter1 + this.diameter2;
  this.memory.push({time: 0, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});

  for (var i=1; i<10000; i++) {
    var distanceOfBall = Math.sqrt(Math.pow((ball1_x-ball2_x),2)+Math.pow((ball1_y-ball2_y),2));
    if (distanceOfBall <= sumOfDiameter) {
      this.forceX1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_x-ball2_x)/distanceOfBall-this.mu*(this.velocityX1-this.velocityX2);
      this.forceY1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_y-ball2_y)/distanceOfBall-this.mu*(this.velocityY1-this.velocityY2);
      this.velocityX1 = this.velocityX1 + this.forceX1/this.mass1*this.deltaTime;
      this.velocityY1 = this.velocityY1 + this.forceY1/this.mass1*this.deltaTime;
      this.velocityX2 = this.velocityX2 - this.forceX1/this.mass2*this.deltaTime;
      this.velocityY2 = this.velocityY2 - this.forceY1/this.mass2*this.deltaTime;
    }

    ball1_x = ball1_x+this.velocityX1*this.deltaTime;
    ball1_y = ball1_y+this.velocityY1*this.deltaTime;
    ball2_x = ball2_x+this.velocityX2*this.deltaTime;
    ball2_y = ball2_y+this.velocityY2*this.deltaTime;
    this.memory.push({time: i, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});
  }
};

NPEngine.Collision2d.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/1); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    this.ball1.x = data.ball1_x;
    this.ball1.y = data.ball1_y;
    this.ball2.x = data.ball2_x;
    this.ball2.y = data.ball2_y;
  }
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
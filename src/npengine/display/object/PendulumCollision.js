NPEngine.PendulumCollision = function(options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  // final variables
  this.deltaTime  = 0.0005;        // second

  // initial variables
  this.k = options.k !== undefined ? options.k : 1000000;    // N/m
  this.mu = options.mu !== undefined ? options.mu : 10;      // N s/m
  this.theta1 = options.theta1 !== undefined ? NPEngine.Convert.toRadians(options.theta1) : 0;    // rad
  this.theta2 = options.theta2 !== undefined ? NPEngine.Convert.toRadians(options.theta2) : NPEngine.Convert.toRadians(45);   // rad

  // other variables
  this.gravity          = 9.8;        // m/s^2
  this.mass             = 0.5;        // kg
  this.lineLength       = 1;          // m
  this.diameter1        = 0.1;        // m
  this.diameter2        = 0.1;        // m
  this.angularVelocity1 = 0;
  this.angularVelocity2 = 0;

  // initial position
  this.pivot1 = new NPEngine.Point;
  this.pivot2 = new NPEngine.Point;

  this.ratio = Math.pow(2, 8);
};

NPEngine.PendulumCollision.prototype.constructor = NPEngine.PendulumCollision;
NPEngine.PendulumCollision.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.PendulumCollision.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.timeBoard = timeBoard;
};

NPEngine.PendulumCollision.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.PendulumCollision.prototype.compute = function () {
  this.memory = [];
  this.pivot1.x = Math.round(this.width/2-this.ratio*this.diameter1);
  this.pivot1.y = 0;
  this.pivot2.x = Math.round(this.width/2+this.ratio*this.diameter2);
  this.pivot2.y = 0;

  var inertia = this.mass*this.lineLength*this.lineLength;  // moment of inertia
  var theta1 = this.theta1;
  var theta2 = this.theta2;
  var angularVelocity1 = this.angularVelocity1;
  var angularVelocity2 = this.angularVelocity2;
  var impulsiveForce = theta1>theta2 ? this.k*(theta1-theta2)*this.lineLength+this.mu*this.lineLength*(angularVelocity1-angularVelocity2) : 0;
  var torque1 = -this.mass*this.gravity*this.lineLength*Math.sin(theta1)-this.lineLength*impulsiveForce;
  var torque2 = -this.mass*this.gravity*this.lineLength*Math.sin(theta2)+this.lineLength*impulsiveForce;
  this.memory.push({
    time: 0,
    theta1: theta1,
    theta2: theta2
  });

  var memoryFlag = 1;
  for (var i=this.deltaTime; i<200000; i++) {
    impulsiveForce = theta1>theta2 ? this.k*(theta1-theta2)*this.lineLength+this.mu*this.lineLength*(angularVelocity1-angularVelocity2) : 0;
    torque1 = -this.mass*this.gravity*this.lineLength*Math.sin(theta1)-this.lineLength*impulsiveForce;
    torque2 = -this.mass*this.gravity*this.lineLength*Math.sin(theta2)+this.lineLength*impulsiveForce;

    angularVelocity1 = angularVelocity1+torque1/inertia*this.deltaTime;
    angularVelocity2 = angularVelocity2+torque2/inertia*this.deltaTime;
    theta1 = theta1+angularVelocity1*this.deltaTime;
    theta2 = theta2+angularVelocity2*this.deltaTime;
    if (memoryFlag==20) {
      memoryFlag=1;
      this.memory.push({
        time: i,
        theta1: theta1,
        theta2: theta2
      });
    }
    else {
      memoryFlag++;
    }
  }
};

NPEngine.PendulumCollision.prototype.onReady = function() {
  this.ball1 = new NPEngine.Point(this.lineLength*Math.sin(this.theta1), this.lineLength*Math.cos(this.theta1));
  this.ball2 = new NPEngine.Point(this.lineLength*Math.sin(this.theta2), this.lineLength*Math.cos(this.theta2));
};

NPEngine.PendulumCollision.prototype.onStart = function() {
};

NPEngine.PendulumCollision.prototype.onResume = function() {
};

NPEngine.PendulumCollision.prototype.onPause = function() {
};

NPEngine.PendulumCollision.prototype.onStop = function() {
};

NPEngine.PendulumCollision.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10);

  this.ball1.x = this.lineLength*Math.sin(this.memory[gap].theta1);
  this.ball1.y = this.lineLength*Math.cos(this.memory[gap].theta1);
  this.ball2.x = this.lineLength*Math.sin(this.memory[gap].theta2);
  this.ball2.y = this.lineLength*Math.cos(this.memory[gap].theta2);
};

NPEngine.PendulumCollision.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.lineWidth = 4;
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  context.beginPath();
  context.moveTo(this.pivot1.x, this.pivot1.y);
  context.lineTo(this.pivot1.x+this.ratio*this.ball1.x, this.pivot1.y+this.ratio*this.ball1.y);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.pivot1.x+this.ratio*this.ball1.x, this.pivot1.y+this.ratio*this.ball1.y, this.ratio*this.diameter1, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(this.pivot2.x, this.pivot2.y);
  context.lineTo(this.pivot2.x+this.ratio*this.ball2.x, this.pivot2.y+this.ratio*this.ball2.y);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.pivot2.x+this.ratio*this.ball2.x, this.pivot2.y+this.ratio*this.ball2.y, this.ratio*this.diameter2, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.stroke();
  context.closePath();
};

NPEngine.PendulumCollision.prototype.setVariables = function (options) {
  options = options || {};

  // initial variables
  this.k = options.k !== undefined ? options.k : 1000000;    // N/m
  this.mu = options.mu !== undefined ? options.mu : 10;      // N s/m
  this.theta1 = options.theta1 !== undefined ? NPEngine.Convert.toRadians(options.theta1) : 0;    // rad
  this.theta2 = options.theta2 !== undefined ? NPEngine.Convert.toRadians(options.theta2) : NPEngine.Convert.toRadians(45);   // rad
};
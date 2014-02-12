NPEngine.Pendulum = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.mass = 10;
  this.length = 5;
  this.gravity = 9.8;
  this.theta0 = 0.785398;
  this.deltaTime = 0.01;

  // initial position
  this.pivot = new NPEngine.Point(400, 0);
  this.circle = new NPEngine.Point;

  this.init();
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.init = function() {
  this.period = Math.round((2 * Math.PI * Math.sqrt(this.length/this.gravity))*(1/this.deltaTime));
  this.circumference = this.length * this.theta0;
  this.startTime = new Date().getTime();
};

NPEngine.Pendulum.prototype.toString = function() {
  return 'Pendulum';
};

NPEngine.Pendulum.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime*1000)); // millisecond to 0.01 second
  var phase = Math.round(gap%this.period);

  this.circle.x = this.memory[phase].x;
  this.circle.y = this.memory[phase].y;
};

NPEngine.Pendulum.prototype.render = function (context) {
  var convertedLength = Math.round(this.length/50)+40;
  var convertedMass = Math.round(this.mass/3)+22;
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function (x, y) {
  this.pivot.x = x;
  this.pivot.y = y;
};

/**
 * Set pendulum's ball by relative pivot's coordinates
 *
 * @method setCircle
 * @param x {Number} The X coord of the point to circle from pivot
 * @param y {Number} The Y coord of the point to circle from pivot
 */
NPEngine.Pendulum.prototype.setCircleCoordsFromPivot = function (x, y) {
  this.circle.x = this.pivot.x + x;
  this.circle.y = this.pivot.y + y;
};

NPEngine.Pendulum.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.Pendulum.prototype.setLength = function (value) {
  this.length = value;
};

NPEngine.Pendulum.prototype.setTheta0 = function (degree) {
  this.theta0 = NPEngine.Convert.toRadians(degree);
};

NPEngine.Pendulum.prototype.setDeltaT = function (value) {
  this.deltaTime = value;
};

NPEngine.Pendulum.prototype.compute = function () {
  this.init();

  this.memory = [];
  var period = this.period;
  var velocity = 0;
  var circumference = this.circumference;

  for (var i=0; i<period; i++) {
    velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
    circumference = circumference+velocity*this.deltaTime;
    var thetaValue = circumference/this.length;
    var xValue = this.length*Math.sin(thetaValue).toFixed(6);
    var yValue = this.length*Math.cos(thetaValue).toFixed(6);
    this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});
  }
};

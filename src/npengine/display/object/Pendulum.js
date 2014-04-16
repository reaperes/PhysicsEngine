NPEngine.Pendulum = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.mass = 10;
  this.length = 2;
  this.gravity = 9.8;
  this.theta0 = NPEngine.Convert.toRadians(30);
  this.deltaTime = 0.01;

  // initial position
  this.pivot = new NPEngine.Point;
  this.curCircle = new NPEngine.Point;
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.pivot.x = Math.round(viewWidth/2);
  this.pivot.y = 0;
  this.timeBoard = timeBoard;
};

NPEngine.Pendulum.prototype.compute = function () {
  this.memory = [];
  if (this.theta0 < 0.5) { /* theta0 is less than about 30 degrees */
    this.period = Math.round((2 * Math.PI * Math.sqrt(this.length/this.gravity))*(1/this.deltaTime));
    var velocity = 0;
    var circumference = this.length * this.theta0;

    for (var i=0; i<this.period; i++) {
      velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
      circumference = circumference+velocity*this.deltaTime;
      var thetaValue = circumference/this.length;
      var xValue = this.length*Math.sin(thetaValue).toFixed(6);
      var yValue = this.length*Math.cos(thetaValue).toFixed(6);
      this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});
    }
  }
  else { /* for theta0 !<< 1 */
    // for performance, I apply uncommon algorithm.
    var flag = false;             // it is used if it is after half or before half
    var isSignPositive = false;
    if (this.theta0 > 0) {
      isSignPositive = true;
    }

    var velocity = 0;
    var circumference = this.length * this.theta0;
    var firstCircumference = circumference;
    var lastGap = Number.MAX_VALUE;

    for (var i=0; ; i++) {
      velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
      circumference = circumference+velocity*this.deltaTime;
      var thetaValue = circumference/this.length;
      var xValue = this.length*Math.sin(thetaValue).toFixed(6);
      var yValue = this.length*Math.cos(thetaValue).toFixed(6);
      this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});

      if (flag == false) {
        if ((circumference>0) != isSignPositive) {
          flag = true;
        }
      }
      else {
        if ((circumference>0) == isSignPositive) {
          var gap = Math.abs(firstCircumference - circumference);
          if (lastGap < gap) {
            this.period = i;
            return ;
          }
          else {
            lastGap = gap;
          }
        }
      }
    }
  }
};

NPEngine.Pendulum.prototype.onReady = function() {
  this.curCircle.x = this.memory[0].x;
  this.curCircle.y = this.memory[0].y;
};

NPEngine.Pendulum.prototype.onStart = function() {
};

NPEngine.Pendulum.prototype.onResume = function() {
};

NPEngine.Pendulum.prototype.onPause = function() {
};

NPEngine.Pendulum.prototype.onStop = function() {
};

NPEngine.Pendulum.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime*1000)); // millisecond to 0.01 second
  var phase = Math.round(gap%this.period);

  this.curCircle.x = this.memory[phase].x;
  this.curCircle.y = this.memory[phase].y;
};

NPEngine.Pendulum.prototype.render = function (context) {
  var convertedLength = Math.round(this.length*5)+60;
  var convertedMass = Math.round(this.mass/3)+22;
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.curCircle.x * convertedLength, this.pivot.y + this.curCircle.y * convertedLength);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.curCircle.x * convertedLength, this.pivot.y + this.curCircle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
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
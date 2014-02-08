NPEngine.Pendulum = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.mass = 1;
  this.length = 1;
  this.gravity = 9.8;
  this.theta0 = 0.785398;
  this.circumference = this.length * this.theta0;
  this.deltaTime = 0.01;

  // initial position
  this.pivot = new NPEngine.Point(0, 0);
  this.circle = new NPEngine.Point(0, 400);

  // etc variables
  this.period = 2 * Math.PI * Math.sqrt(this.length/this.gravity);

  // update variables
  this.isStart = false;
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.toString = function() {
  return 'Pendulum';
};

NPEngine.Pendulum.prototype.update = function () {
  var that = this;
  if (this.isStart == false) {
    this.startTime = new Date().getTime();
    this.isStart = true;
  }
  var gap = (new Date().getTime() - this.startTime) / 10; // millisecond to 0.01 second
  var phase = (gap % this.period).toFixed(2);
  var store = this.db.transaction([this.toString()],"readonly").objectStore(this.toString());
  console.log('phase = ' + phase*100);
  var request = store.get(phase*100);
  request.onsuccess = function(e) {
    var data = request.result;
    console.log('data = ' + data);
    that.circle.x = data.x;
    that.circle.y = data.y;
  }
  request.onerror = function(e) {
    alert('db error');
  }
};

NPEngine.Pendulum.prototype.render = function (context) {
  // draw line
  this.ratio = 100;
  context.beginPath();
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.circle.x * this.ratio, this.pivot.y + this.circle.y * this.ratio);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.circle.x * this.ratio, this.pivot.y + this.circle.y * this.ratio, 10, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function (x, y) {
  if (x == 'undefined' || y == 'undefined')
    throw new Error(x + 'or ' + y + ' is undefined');

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
  if (x == 'undefined' || y == 'undefined')
    throw new Error(x + 'or ' + y + ' is undefined');

  this.circle.x = this.pivot.x + x;
  this.circle.y = this.pivot.y + y;
};

NPEngine.Pendulum.prototype.setMass = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }

  this.circleMass = value;
  this.calculateRadius();
};

NPEngine.Pendulum.prototype.setLineLength = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.lineLength = value;
};

NPEngine.Pendulum.prototype.setTheta0 = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.circleTheta0 = value;
  this.circlePosition0 = this.lineLength * this.circleTheta0;
  this.circumference = this.circlePosition0;
};

NPEngine.Pendulum.prototype.setT = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.t = value;
};

NPEngine.Pendulum.prototype.compute = function (db) {
  this.db = db;
  var period = this.period;
  var velocity = 0;
  var circumference = this.circumference;

  var objectStore = db.transaction([this.toString()],"readwrite").objectStore(this.toString());
  for (var i=0; i<period*100; i++) {
    velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
    circumference = circumference+velocity*this.deltaTime;
    var thetaValue = circumference/this.length;
    var xValue = this.length*Math.sin(thetaValue).toFixed(6);
    var yValue = this.length*Math.cos(thetaValue).toFixed(6);
    objectStore.add({time: i, theta: thetaValue, x: xValue, y: yValue});
  }
};
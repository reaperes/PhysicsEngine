NPEngine.Kepler = function(options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  this.deltaTime = 0.01;   // seconds

  // exception
  if (options.speed !== undefined) {
    options.speed = options.speed < 1 ? 1 : options.speed;
    options.speed = options.speed > 10 ? 10 : options.speed;
  }

  // init variables
  var speed = options.speed !== undefined ? options.speed : 5;
  this.augmentedFactor = options.augmentedFactor !== undefined ? options.augmentedFactor : 30;
  this.dampingFactor = options.dampingFactor !== undefined ? options.dampingFactor : 1;


  this.slowFactor = 10 - speed;

  this.G = 1.18e-19;
  this.earthMass = 1;
  this.sunMass = 332965;
  this.moonMass = 0.012321;

  this.earthFarVelocity = 29304.64558;    // m/s

  this.earthVelocityX = 0;
  this.earthVelocityY = this.earthFarVelocity/1.50e+11*this.dampingFactor;
  this.earthX = 1.013333;
  this.earthY = 0;
  this.moonVelocityX = 0;
  this.moonVelocityY = this.earthVelocityY+1018.326257/1.50E+11;
  this.moonX = 1.015896;
  this.moonY = 0;
};

NPEngine.Kepler.prototype.constructor = NPEngine.Kepler;
NPEngine.Kepler.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.Kepler.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.Kepler.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Kepler.prototype.compute = function () {
  this.memory = [];

  var earthX = this.earthX;
  var earthY = this.earthY;
  var moonX = this.moonX;
  var moonY = this.moonY;
  var sunEarthDistance = Math.sqrt(earthX*earthX+earthY*earthY);
  var sunMoonDistance = Math.sqrt(moonX*moonX+moonY*moonY);
  var moonEarthDistance = Math.sqrt((moonX-earthX)*(moonX-earthX)+(moonY-earthY)*(moonY-earthY));
  var earthVelocityX = this.earthVelocityX;
  var earthVelocityY = this.earthVelocityY;
  var moonVelocityX = this.moonVelocityX;
  var moonVelocityY = this.moonVelocityY;
  var sunEarthForceX = -this.G*this.sunMass*this.earthMass*earthX/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
  var sunEarthForceY = -this.G*this.sunMass*this.earthMass*earthY/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
  var earthMoonForceX = -this.G*this.earthMass*this.moonMass*(moonX-earthX)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
  var earthMoonForceY = -this.G*this.earthMass*this.moonMass*(moonY-earthY)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
  var sunMoonForceX = -this.G*this.sunMass*this.moonMass*moonX/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
  var sunMoonForceY = -this.G*this.sunMass*this.moonMass*moonY/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
  var earthForceX = sunEarthForceX-earthMoonForceX;
  var earthForceY = sunEarthForceY-earthMoonForceY;
  var moonForceX = sunMoonForceX+earthMoonForceX;
  var moonForceY = sunMoonForceY+earthMoonForceY;

  var augmentedMoonX = earthX+this.augmentedFactor*(moonX-earthX);
  var augmentedMoonY = earthY+this.augmentedFactor*(moonY-earthY);

  this.memory.push({
    earthX: earthX,
    earthY: earthY,
    moonX: augmentedMoonX,
    moonY: augmentedMoonY
  });

  for (var i= 1; i<10000; i++) {
    earthVelocityX = earthVelocityX+earthForceX/this.earthMass*24*3600;
    earthVelocityY = earthVelocityY+earthForceY/this.earthMass*24*3600;
    earthX = earthX+earthVelocityX*24*3600;
    earthY = earthY+earthVelocityY*24*3600;

    moonVelocityX = moonVelocityX+moonForceX/this.moonMass*24*3600;
    moonVelocityY = moonVelocityY+moonForceY/this.moonMass*24*3600;
    moonX = moonX+moonVelocityX*24*3600;
    moonY = moonY+moonVelocityY*24*3600;

    sunEarthDistance = Math.sqrt(earthX*earthX+earthY*earthY);
    sunMoonDistance = Math.sqrt(moonX*moonX+moonY*moonY);
    moonEarthDistance = Math.sqrt((moonX-earthX)*(moonX-earthX)+(moonY-earthY)*(moonY-earthY));
    sunEarthForceX = -this.G*this.sunMass*this.earthMass*earthX/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
    sunEarthForceY = -this.G*this.sunMass*this.earthMass*earthY/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
    earthMoonForceX = -this.G*this.earthMass*this.moonMass*(moonX-earthX)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
    earthMoonForceY = -this.G*this.earthMass*this.moonMass*(moonY-earthY)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
    sunMoonForceX = -this.G*this.sunMass*this.moonMass*moonX/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
    sunMoonForceY = -this.G*this.sunMass*this.moonMass*moonY/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
    earthForceX = sunEarthForceX-earthMoonForceX;
    earthForceY = sunEarthForceY-earthMoonForceY;
    moonForceX = sunMoonForceX+earthMoonForceX;
    moonForceY = sunMoonForceY+earthMoonForceY;

    augmentedMoonX = earthX+this.augmentedFactor*(moonX-earthX);
    augmentedMoonY = earthY+this.augmentedFactor*(moonY-earthY);

    this.memory.push({
      earthX: earthX,
      earthY: earthY,
      moonX: augmentedMoonX,
      moonY: augmentedMoonY
    });
  }
};

NPEngine.Kepler.prototype.onReady = function() {
  var data = this.memory[0];
  this.curEarthX = this.grid.convertToVectorValueX(data.earthX);
  this.curEarthY = this.grid.convertToVectorValueY(data.earthY);
  this.curMoonX = this.grid.convertToVectorValueX(data.moonX);
  this.curMoonY = this.grid.convertToVectorValueY(data.moonY);
};

NPEngine.Kepler.prototype.onStart = function() {
};

NPEngine.Kepler.prototype.onResume = function() {
};

NPEngine.Kepler.prototype.onPause = function() {
};

NPEngine.Kepler.prototype.onStop = function() {
};

NPEngine.Kepler.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(10*this.slowFactor)); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curEarthX = this.grid.convertToVectorValueX(data.earthX);
  this.curEarthY = this.grid.convertToVectorValueY(data.earthY);
  this.curMoonX = this.grid.convertToVectorValueX(data.moonX);
  this.curMoonY = this.grid.convertToVectorValueY(data.moonY);
};

NPEngine.Kepler.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.fillStyle = fill;

  context.beginPath();
  context.arc(this.grid.convertToVectorValueX(0), this.grid.convertToVectorValueY(0), 20, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.curEarthX, this.curEarthY, 8, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(this.curMoonX, this.curMoonY, 3, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();
  context.closePath();
};

NPEngine.Kepler.prototype.setVariables = function(options) {
  options = options || {};

  // exception
  if (options.speed !== undefined) {
    options.speed = options.speed < 0 ? 0 : options.speed;
    options.speed = options.speed > 10 ? 10 : options.speed;
  }

  // init variables
  var speed = options.speed !== undefined ? options.speed : 5;
  this.augmentedFactor = options.augmentedFactor !== undefined ? options.augmentedFactor : 30;
  this.dampingFactor = options.dampingFactor !== undefined ? options.dampingFactor : 1;

  this.slowFactor = 10 - speed;
  this.earthVelocityY = this.earthFarVelocity/1.50e+11*this.dampingFactor;
  this.moonVelocityY = this.earthVelocityY+1018.326257/1.50E+11;
};
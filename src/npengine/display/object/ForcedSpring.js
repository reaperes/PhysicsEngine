NPEngine.ForcedSpring = function () {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle();
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // initial variables
  this.mass = 2;      // kg *
  this.k = 100;       // N/m *

  this.f0 = 20;       // n *
  this.angularVelocity0 = Math.sqrt(this.k/this.mass);
  this.ww0  = 0.5;    // w / w0 *
  this.angularVelocity = this.angularVelocity0*this.ww0;
  this.phase = 3.141592;  // radian *

  this.gravity = 9.8; // m/s^2
  this.mu = 0;        // N s/m *

  this.block.center.x = 0.1;    // m *
  this.block.center.y = 0;    // m/s

  this.velocity = 0;  // m/s
  this.deltaTime = 0.01;
};

NPEngine.ForcedSpring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.ForcedSpring.prototype.constructor = NPEngine.ForcedSpring;



NPEngine.ForcedSpring.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
};

NPEngine.ForcedSpring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.ForcedSpring.prototype.compute = function () {
  this.memory = [];
  var time = 0;
  var blockPosX = this.block.center.x;
  var velocity = this.velocity;
  var angularVelocity = this.angularVelocity;
  var outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase)
  var frictionForce = -this.mu*velocity;
  var springForce =  -this.k*blockPosX;
  var acceleration = (outerForce+frictionForce+springForce)/this.mass;
  this.memory.push({blockPosX: blockPosX});

  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    time = time + this.deltaTime;
    velocity = velocity+acceleration*this.deltaTime;
    blockPosX = blockPosX+velocity*this.deltaTime;
    outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase)
    frictionForce = -this.mu*velocity;
    springForce =  -this.k*blockPosX;
    acceleration = (outerForce+frictionForce+springForce)/this.mass;
    this.memory.push({blockPosX: blockPosX});
  }
};

NPEngine.ForcedSpring.prototype.onReady = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.convertedBlockPosX = this.grid.convertToVectorValueX(this.memory[0].blockPosX);
};

NPEngine.ForcedSpring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
};

NPEngine.ForcedSpring.prototype.onStop = function() {
};

NPEngine.ForcedSpring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.ForcedSpring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 6;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();

  context.beginPath();
  context.lineWidth = 1;
  context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.ForcedSpring.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.ForcedSpring.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.ForcedSpring.prototype.setF0 = function (value) {
  this.f0 = value;
};

NPEngine.ForcedSpring.prototype.setWW0 = function (value) {
  this.ww0 = value;
  this.angularVelocity = this.angularVelocity0*this.ww0;
};

NPEngine.ForcedSpring.prototype.setPhase = function (value) {
  this.phase = value;
};

NPEngine.ForcedSpring.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.ForcedSpring.prototype.setX = function (value) {
  this.block.center.x = value;
};

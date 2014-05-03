NPEngine.ForcedSpring = function (options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  // final variables
  this.deltaTime = 0.01;

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle;
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // initial variables
  this.k = options.k !== undefined ? options.k : 100;             // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;            // N s/m

  this.mass = options.mass !== undefined ? options.mass : 2;      // kg
  this.block.center.x = options.blockX0 !== undefined ? options.blockX0 : 0.1; // m
  this.block.center.y = 0;    // m/s
  this.f0 = options.f0 !== undefined ? options.f0 : 20;           // N
  this.frequency = options.ww0 !== undefined ? options.ww0 : 0.5;       // w / w0
  this.phase = options.phase !== undefined ? options.phase : 3.141592;  // rad

  this.angularVelocity0 = Math.sqrt(this.k/this.mass);
  this.angularVelocity = this.angularVelocity0*this.frequency;
  this.gravity = 9.8; // m/s^2
  this.velocity = 0;  // m/s
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
  var outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase);
  var frictionForce = -this.mu*velocity;
  var springForce =  -this.k*blockPosX;
  var acceleration = (outerForce+frictionForce+springForce)/this.mass;
  this.memory.push({blockPosX: blockPosX});

  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    time = time + this.deltaTime;
    velocity = velocity+acceleration*this.deltaTime;
    blockPosX = blockPosX+velocity*this.deltaTime;
    outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase);
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
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.strokeStyle = stroke;
  context.fillStyle = fill;

  context.beginPath();
  context.lineWidth = 6;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.lineWidth = 1;
  context.fillRect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.stroke();
  context.closePath();
};

NPEngine.ForcedSpring.prototype.setVariables = function(options) {
  options = options || {};

  this.k = options.k !== undefined ? options.k : 100;             // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;            // N s/m

  this.mass = options.mass !== undefined ? options.mass : 2;      // kg
  this.block.center.x = options.blockX0 !== undefined ? options.blockX0 : 0.1; // m
  this.f0 = options.f0 !== undefined ? options.f0 : 20;           // N
  this.frequency = options.ww0 !== undefined ? options.ww0 : 0.5;       // w / w0
  this.phase = options.phase !== undefined ? options.phase : 3.141592;  // rad

  this.angularVelocity0 = Math.sqrt(this.k/this.mass);
  this.angularVelocity = this.angularVelocity0*this.frequency;
}
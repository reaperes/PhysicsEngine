NPEngine.Spring = function () {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle();
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // initial variables
  this.mass = 2;      // kg
  this.k = 100;       // N/m
  this.gravity = 9.8; // m/s^2
  this.mu = 3;        // N s/m
  this.block.center.x = 1;    // m
  this.block.center.y = 0;    // m/s
  this.velocity = 0;  // m/s
  this.deltaTime = 0.01;
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.Spring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Spring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.startTime = new Date().getTime();
};

NPEngine.Spring.prototype.onStop = function() {
};

NPEngine.Spring.prototype.compute = function () {
  this.memory = [];
  var blockPosX = this.block.center.x;
  var velocity = this.velocity;
  var force = -this.k*blockPosX-this.mu*velocity;
  this.memory.push({time: 0, blockPosX: blockPosX});

  for (var i=1; i<10000; i++) {
    velocity = velocity+force/this.mass*this.deltaTime;
    blockPosX = blockPosX+velocity*this.deltaTime;
    force = -this.k*blockPosX-this.mu*velocity;
    this.memory.push({time: i, blockPosX: blockPosX});
  }
};

NPEngine.Spring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.Spring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 4;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();

  context.beginPath();
  context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Spring.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.Spring.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.Spring.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.Spring.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.Spring.prototype.setX = function (value) {
  this.block.center.x = value;
};

NPEngine.Spring.prototype.setVelocity = function (value) {
  this.velocity = value;
};

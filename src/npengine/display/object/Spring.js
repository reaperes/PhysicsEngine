NPEngine.Spring = function (options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};

  // compute variable
  this.deltaTime = 0.01;

  // initial variables
  this.mass = options.mass !== undefined ? options.mass : 2;  // kg
  this.k = options.k !== undefined ? options.k : 100;         // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;        // N s/m

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle();
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // extend variables
  this.gravity = 9.8;         // m/s^2
  this.block.center.x = 2;    // m
  this.block.center.y = 0;    // m/s
  this.velocity = 0;          // m/s
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
};

NPEngine.Spring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
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

NPEngine.Spring.prototype.onReady = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.convertedBlockPosX = this.grid.convertToVectorValueX(this.memory[0].blockPosX);
};

NPEngine.Spring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
};

NPEngine.Spring.prototype.onStop = function() {
};

NPEngine.Spring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.Spring.prototype.render = function (context) {
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.beginPath();
    context.lineWidth = 6;
    context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
    context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
    context.strokeStyle = stroke;
    context.stroke();
  context.closePath();

  context.beginPath();
    context.lineWidth = 1;
    context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
    context.fillStyle = 'black';
    context.fillStyle = fill;
    context.fill();
  context.closePath();

  // temp code period
  context.font = "20px Arial";
  context.fillText("주기: " + (2*Math.PI*Math.sqrt(this.mass/this.k)).toFixed(2) + "초", 0, 52);
};

NPEngine.Spring.prototype.setVariables = function (options) {
  options = options || {};

  this.mass = options.mass !== undefined ? options.mass : 2;  // kg
  this.k = options.k !== undefined ? options.k : 100;         // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;        // N s/m
};

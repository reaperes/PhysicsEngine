NPEngine.RotationPlusGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;

  this.ratio = 60;
};

NPEngine.RotationPlusGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.RotationPlusGrid.prototype.constructor = NPEngine.RotationPlusGrid;



NPEngine.RotationPlusGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/4);
  this.centerHeight = viewHeight-80;
};

NPEngine.RotationPlusGrid.prototype.compute = function () {
};

NPEngine.RotationPlusGrid.prototype.update = function () {
};

NPEngine.RotationPlusGrid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = '#550000';

  // draw left column line
  for (var i=this.centerWidth-this.ratio; i>0; i-=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw right column line
  for (var i=this.centerWidth+this.ratio; i<this.width; i+=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerHeight; i>0; i-=this.ratio) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }

  // draw lower row line
  for (var i=this.centerHeight; i<this.height; i+=this.ratio) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }
  context.stroke();

  // draw center line
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = '#550000';
  context.moveTo(this.centerWidth, 0);
  context.lineTo(this.centerWidth, this.height);
  context.moveTo(0, this.centerHeight);
  context.lineTo(this.width, this.centerHeight);
  context.stroke();
};

NPEngine.RotationPlusGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.RotationPlusGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.RotationPlusGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * this.ratio;
  var convertedY = this.centerHeight + point.y * -this.ratio;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.RotationPlusGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * this.ratio;
};

NPEngine.RotationPlusGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -this.ratio;
};

NPEngine.RotationPlusGrid.prototype.convertToGridScalaValue = function(value) {
  return value*this.ratio;
};

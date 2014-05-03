NPEngine.RotationGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
};

NPEngine.RotationGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.RotationGrid.prototype.constructor = NPEngine.RotationGrid;



NPEngine.RotationGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = viewHeight-80;
};

NPEngine.RotationGrid.prototype.compute = function () {
};

NPEngine.RotationGrid.prototype.update = function () {
};

NPEngine.RotationGrid.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.strokeStyle = stroke;

  context.beginPath();
  context.lineWidth = 0.5;
  // draw left column line
  for (var i=this.centerWidth-100; i>0; i-=100) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw right column line
  for (var i=this.centerWidth+100; i<this.width; i+=100) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerHeight; i>0; i-=100) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }

  // draw lower row line
  for (var i=this.centerHeight; i<this.height; i+=100) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }
  context.stroke();
  context.closePath();

  // draw center line
  context.beginPath();
  context.moveTo(this.centerWidth, 0);
  context.lineTo(this.centerWidth, this.height);
  context.moveTo(0, this.centerHeight);
  context.lineTo(this.width, this.centerHeight);
  context.stroke();
  context.closePath();
};

NPEngine.RotationGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.RotationGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.RotationGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * 100;
  var convertedY = this.centerHeight + point.y * -100;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.RotationGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * 100;
};

NPEngine.RotationGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -100;
};

NPEngine.RotationGrid.prototype.convertToGridScalaValue = function(value) {
  return value*100;
};

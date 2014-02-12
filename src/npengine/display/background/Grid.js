NPEngine.Grid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
};

NPEngine.Grid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Grid.prototype.constructor = NPEngine.Grid;



NPEngine.Grid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = Math.round(viewHeight/2);
};

NPEngine.Grid.prototype.compute = function () {
};

NPEngine.Grid.prototype.update = function () {
};

NPEngine.Grid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = '#550000';

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

NPEngine.Grid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.Grid.prototype.setHeight = function(height) {
  this.width = width;
};

NPEngine.Grid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * 100;
  var convertedY = this.centerHeight + point.y * -100;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.Grid.prototype.convertToGridValue = function(value) {
  return value*100;
};

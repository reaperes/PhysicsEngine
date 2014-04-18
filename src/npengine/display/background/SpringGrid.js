NPEngine.SpringGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
  this.ratio = 150;
};

NPEngine.SpringGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.SpringGrid.prototype.constructor = NPEngine.SpringGrid;



NPEngine.SpringGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = Math.round(viewHeight/2);
};

NPEngine.SpringGrid.prototype.compute = function () {
};

NPEngine.SpringGrid.prototype.update = function () {
};

NPEngine.SpringGrid.prototype.render = function (context) {
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

NPEngine.SpringGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.SpringGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.SpringGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * this.ratio;
  var convertedY = this.centerHeight + point.y * this.ratio;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.SpringGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * this.ratio;
};

NPEngine.SpringGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -this.ratio;
};

NPEngine.SpringGrid.prototype.convertToGridScalaValue = function(value) {
  return value*this.ratio;
};

NPEngine.QuadrantGrid = function() {
  NPEngine.DisplayObject.call(this);
  this.ratio = 80;
};

NPEngine.QuadrantGrid.prototype.constructor = NPEngine.QuadrantGrid;
NPEngine.QuadrantGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.QuadrantGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;

  // 80 is default default interval
  this.centerX = this.ratio;
  this.centerY = viewHeight-this.ratio;
};

NPEngine.QuadrantGrid.prototype.onAttachedGrid = function (gridObject) {
};

NPEngine.QuadrantGrid.prototype.compute = function () {
};

NPEngine.QuadrantGrid.prototype.onReady = function() {
};

NPEngine.QuadrantGrid.prototype.onStart = function() {
};

NPEngine.QuadrantGrid.prototype.onResume = function() {
};

NPEngine.QuadrantGrid.prototype.onPause = function() {
};

NPEngine.QuadrantGrid.prototype.onStop = function() {
};

NPEngine.QuadrantGrid.prototype.update = function () {
};

NPEngine.QuadrantGrid.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.6)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.strokeStyle = stroke;

  context.beginPath();
  context.lineWidth = 0.4;

  // draw right column line
  for (var i=this.centerX+this.ratio; i<this.width; i+=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerY; i>0; i-=this.ratio) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }
  context.stroke();
  context.closePath();

  // draw center line
  context.beginPath();
  context.lineWidth = 1;
  context.moveTo(this.centerX, 0);
  context.lineTo(this.centerX, this.height);
  context.moveTo(0, this.centerY);
  context.lineTo(this.width, this.centerY);
  context.stroke();
  context.closePath();
};

NPEngine.QuadrantGrid.prototype.setRatio = function(value) {
  this.ratio = value;
};

NPEngine.QuadrantGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerX+point.x/this.ratio*this.ratio;
  var convertedY = this.centerY+point.y/this.ratio*-this.ratio;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.QuadrantGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerX + x/this.ratio * this.ratio;
};

NPEngine.QuadrantGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerY + y/this.ratio * -this.ratio;
};

NPEngine.QuadrantGrid.prototype.convertToGridScalaValue = function(value) {
  return value/this.ratio*this.ratio;
};

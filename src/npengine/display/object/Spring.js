NPEngine.Spring = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.pivot = new NPEngine.Point(0, 300);
  this.block = new NPEngine.Point(300, 300);
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.pivot.x = 0;
  this.pivot.y = parseInt(viewHeight/2);
  this.block.x = parseInt(viewWidth/2);
  this.block.y = parseInt(viewHeight/2);
};

NPEngine.Spring.prototype.update = function () {
};

NPEngine.Spring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.block.x, this.block.y);
  context.stroke();

//  context.beginPath();
//  context.arc(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
//  context.fillStyle = 'black';
//  context.fill();
//  context.stroke();
};

NPEngine.Spring.prototype.compute = function () {
};

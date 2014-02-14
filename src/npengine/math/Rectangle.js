NPEngine.Rectangle = function(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.center = new NPEngine.Point;
};

NPEngine.Rectangle.prototype.constructor = NPEngine.Rectangle;


NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.ball1 = new NPEngine.Point;
  this.ball2 = new NPEngine.Point;
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.ball1.x = -0.1;
  this.ball1.y = 0.1;
  this.ball2.x = 0.1;
  this.ball2.y = 0;
};

NPEngine.Collision2d.prototype.update = function () {
};

NPEngine.Collision2d.prototype.render = function (context) {
  cont
};

NPEngine.Collision2d.prototype.compute = function () {
};

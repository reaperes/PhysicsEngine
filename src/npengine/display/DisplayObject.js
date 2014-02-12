NPEngine.DisplayObject = function() {
  NPEngine.PhysicsObject.call(this);
};

NPEngine.DisplayObject.prototype = Object.create(NPEngine.PhysicsObject.prototype);
NPEngine.DisplayObject.prototype.constructor = NPEngine.DisplayObject;



NPEngine.DisplayObject.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.DisplayObject.prototype.update = function () {
};

NPEngine.DisplayObject.prototype.render = function (context) {
};

NPEngine.DisplayObject.prototype.compute = function () {
};

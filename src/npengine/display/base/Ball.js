NPEngine.Ball = function () {
  NPEngine.PhysicsObject.call(this);
};

NPEngine.Ball.prototype = Object.create(NPEngine.PhysicsObject.prototype);
NPEngine.Ball.prototype.constructor = NPEngine.Ball;

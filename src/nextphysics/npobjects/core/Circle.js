/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Circle
 * @constructor
 */
NP.Circle = function(x, y, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.CIRCLE;

  this.x = x !== undefined ? this.x : x;
  this.y = y !== undefined ? this.y : y;
  this.radius = radius !== undefined ? this.radius : radius;
};

NP.Circle.prototype = Object.create(NP.Object.prototype);
NP.Circle.prototype.constructor = NP.Circle;

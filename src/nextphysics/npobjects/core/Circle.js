/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Circle
 * @constructor
 */
NP.Circle = function(x, y, z, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.CIRCLE;

  this.position.x = x !== undefined ? x : this.position.x;
  this.position.y = y !== undefined ? y : this.position.y;
  this.position.z = z !== undefined ? z : this.position.z;
  this.radius = radius !== undefined ? radius : 1;
};

NP.Circle.prototype = Object.create(NP.Object.prototype);
NP.Circle.prototype.constructor = NP.Circle;

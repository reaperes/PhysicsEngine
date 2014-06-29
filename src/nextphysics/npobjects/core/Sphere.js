/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Sphere
 * @constructor
 */
NP.Sphere = function(x, y, z, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.SPHERE;

  this.x = x !== undefined ? x : this.x;
  this.y = y !== undefined ? y : this.y;
  this.z = z !== undefined ? z : this.z;
  this.radius = radius !== undefined ? radius : this.radius;
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

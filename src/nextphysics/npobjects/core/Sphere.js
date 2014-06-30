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

  this.position.x = x !== undefined ? x : this.position.x;
  this.position.y = y !== undefined ? y : this.position.y;
  this.position.z = z !== undefined ? z : this.position.z;
  this.radius = radius !== undefined ? radius : this.radius;
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

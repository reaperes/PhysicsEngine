/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.GravityForce
 * @constructor
 */
NP.GravityForce = function(gravity) {
  NP.Force.call(this);

  gravity = gravity || 9.8;
  this.__defineGetter__('gravity', function() {
    return gravity;
  });
  this.__defineSetter__('gravity', function(value) {
    gravity = value;
    this.vector.y = -value;
  });

  this.vector.x = 0;
  this.vector.y = -gravity;
  this.vector.z = 0;
};

NP.GravityForce.prototype = Object.create(NP.Force.prototype);
NP.GravityForce.prototype.constructor = NP.GravityForce;

NP.GravityForce.prototype.update = function() {
  // gravitational force is constant.
};
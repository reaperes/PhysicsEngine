/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.TensionForce
 * @constructor
 * @param pivot {NP.Vec3} the point of pivot
 * @param reaction {NP.Force} the reaction force
 */
NP.TensionForce = function(pivot, reaction) {
  NP.Force.call(this);

  this.pivot = pivot !== undefined ? pivot : new NP.Vec3();
  this.reactionForce = reaction !== undefined ? reaction : new NP.Vec3();
};

NP.GravityForce.prototype = Object.create(NP.Force.prototype);
NP.GravityForce.prototype.constructor = NP.GravityForce;

NP.GravityForce.prototype.update = function() {
  // todo: consider 3d tension



//  this.reactionForce * Math.cos(theta);
};

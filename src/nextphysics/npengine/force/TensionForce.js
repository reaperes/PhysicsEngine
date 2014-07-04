/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.TensionForce
 * @constructor
 * @param pivot {THREE.Vector3} the point of pivot
 * @param object {NP.Object}
 */
NP.TensionForce = function(pivot, object) {
  NP.Force.call(this);

  this.pivot = pivot !== undefined ? pivot : new THREE.Vector3();
  this.object = object !== undefined ? object : new NP.Object();
};

NP.TensionForce.prototype = Object.create(NP.Force.prototype);
NP.TensionForce.prototype.constructor = NP.TensionForce;

NP.TensionForce.prototype.update = function() {
  var distanceToObject = this.pivot.distanceTo(this.object.position);
  var cosTheta = Math.abs(this.object.position.y - this.pivot.y) / distanceToObject;
  this.vector = this.object.force.clone().multiplyScalar(-cosTheta);
};

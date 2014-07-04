/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Line
 * @constructor
 */
NP.Line = function(position, v2) {
  NP.Object.call(this);
  this.type = NP.Object.Type.LINE;

  this.forceFlag = false;

  this.position = position !== undefined ? position : new THREE.Vector3();
  this.v2 = v2 !== undefined ? v2 : new THREE.Vector3();
};

NP.Line.prototype = Object.create(NP.Object.prototype);
NP.Line.prototype.constructor = NP.Line;

NP.Line.prototype.update = function(deltaT) {
};

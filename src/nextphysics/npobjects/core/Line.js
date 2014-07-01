/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Line
 * @constructor
 */
NP.Line = function(v1, v2) {
  NP.Object.call(this);
  this.type = NP.Object.Type.LINE;

  this.v1 = v1 !== undefined ? v1 : new NP.Vec3();
  this.v2 = v2 !== undefined ? v2 : new NP.Vec3();
  this.position = this.v1;
};

NP.Line.prototype = Object.create(NP.Object.prototype);
NP.Line.prototype.constructor = NP.Line;

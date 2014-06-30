/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function() {
  this.vector = new NP.Vec3();
};

NP.Force.prototype.constructor = NP.Force;

NP.Force.GRAVITY = 'gravity';

/**
 * Convert to Array list
 *
 * @method list
 */
NP.Force.prototype.list = function() {
  return this.vector.list();
};

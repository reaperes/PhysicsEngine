/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function() {
  this.position = new NP.Vec3();
  this.vector = new NP.Vec3();
};

NP.Force.prototype.constructor = NP.Force;

NP.Force.Type = {
  GRAVITY: 'gravity',
  TENSION: 'tension'
};

/**
 * Convert to Array list
 *
 * @method list
 */
NP.Force.prototype.list = function() {
  return this.vector.list();
};

/**
 * Update force
 *
 * @method update
 */
NP.Force.prototype.update = function() {
  throw new Error('Update function must be override.');
};
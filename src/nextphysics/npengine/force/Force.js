/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function() {
  this.x = 0;
  this.y = 0;
};

NP.Force.prototype.constructor = NP.Force;

NP.Force.GRAVITY = 'gravity';

/**
 * Convert to Array list
 *
 * @method list
 */
NP.Force.prototype.list = function() {
  this.list = function() {
    return [this.x, this.y];
  };
};

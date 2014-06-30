/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Point
 * @constructor
 */
NP.Point = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

  /**
   * Convert to Array list
   *
   * @method list
   */
  this.list = function() {
    return [this.x, this.y, this.z];
  }
};

NP.Point.prototype.constructor = NP.Point;

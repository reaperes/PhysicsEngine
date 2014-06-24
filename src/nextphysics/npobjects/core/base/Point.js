/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Point
 * @constructor
 */
NP.Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;

  /**
   * Convert to Array list
   *
   * @method list
   */
  this.list = function() {
    return [this.x, this.y];
  }
};

NP.Point.prototype.constructor = NP.Point;

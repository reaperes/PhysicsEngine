/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class Point
 * @constructor
 * @param x {Number} The X coordinate of this point
 * @param y {Number} The Y coordinate of this point
 */

NPEngine.Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

NPEngine.Point.prototype = {
  constructor: NPEngine.Point
};

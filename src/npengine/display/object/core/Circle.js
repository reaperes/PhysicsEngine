/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Circle NPObject
 *
 * @class Circle
 * @constructor
 * @param x {Number} The X coordinate of the center of this circle
 * @param y {Number} The Y coordinate of the center of this circle
 * @param radius {Number} The radius of the circle
 */
NPEngine.Circle = function(x, y, radius) {
  /**
   * @property x
   * @type Number
   * @default 0
   */
  this.x = x || 0;

  /**
   * @property y
   * @type Number
   * @default 0
   */
  this.y = y || 0;

  /**
   * @property radius
   * @type Number
   * @default 0
   */
  this.radius = radius || 0;
};

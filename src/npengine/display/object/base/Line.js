/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class Line
 * @constructor
 * @param x1 {Number} The X1 coordinate of this line
 * @param y1 {Number} The Y1 coordinate of this line
 * @param x2 {Number} The X2 coordinate of this line
 * @param y2 {Number} The Y2 coordinate of this line
 */
NPEngine.Line = function(x1, y1, x2, y2) {
  /**
   * @property x1
   * @type Number
   * @default 0
   */
  this.x1 = x1 || 0;

  /**
   * @property y1
   * @type Number
   * @default 0
   */
  this.y1 = y1 || 0;

  /**
   * @property x2
   * @type Number
   * @default 0
   */
  this.x2 = x2 || 0;

  /**
   * @property y2
   * @type Number
   * @default 0
   */
  this.y2 = y2 || 0;

  /**
   * @property lineLength
   * @type Number
   */
  this.lineLength = Math.sqrt((x2-x1)*(x2-x1)-(y2-y1)*(y2-y1));

  /**
   * @property lineWidth
   * @type Number
   * @default 1
   */
  this.lineWidth = 1;
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Object
 * @constructor
 */
NP.Object = function() {
  this.x = 0;
  this.y = 0;
  this.radius = 1;
};

NP.Object.prototype = {
  constructor: NP.Object
};

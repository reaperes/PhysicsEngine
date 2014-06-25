/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Everything can be on canvas is inherited NP.Object
 *
 * @class NP.Object
 * @constructor
 */
NP.Object = function() {
  /**
   * Type of object
   *
   * @property type
   * @type NP.Object.Type
   */
  this.type = undefined;

  /**
   * Forces of object
   *
   * @property forces
   * @type Object
   */
  this.forces = {};

  /**
   * Net force of object. Unit is Newton.
   * [0] = x, [1] = y.
   *
   * @property force
   * @type Array[Number]
   */
  this.force = [0, 0];

  /**
   * The velocity of object. Unit is m/s.
   * [0] = x, [1] = y.
   *
   * @property velocity
   * @type Array[Number]
   */
  this.velocity = [0, 0];

  /**
   * Position of object. Unit is m.
   * [0] = x, [1] = y.
   *
   * @property position
   * @type Array[Number]
   */
  this.position = [0, 0];
};

NP.Object.prototype.constructor = NP.Object;


/**
 * Add force, etc.
 *
 * @method add
 */
NP.Object.prototype.add = (function() {
  /**
   * After parsing force object, add force object, and calculate net force of this object.
   *
   * @method addForce
   * @param forces {Object} object of forces
   */
  var addForce = function(forces) {
    var i, len;

    for (i=0, len=Object.keys(forces).length; i<len; i++) {
      if ('gravity' === forces[i]) {
        this.forces['gravity'] = forces[i] === 'default' ? new NP.GravityForce() : new NP.GravityForce(forces[i]);
      }
    }
  };

  return function() {
    var i, len, key;
    for (i=0, len=arguments.length; i<len; i++) {
      for (key in arguments[i]) {
        if (key === 'force') {
          addForce(arguments[i]['force']);
        }
      }
    }
  }
})();

NP.Object.Type = {};
NP.Object.Type.CIRCLE = 'circle';
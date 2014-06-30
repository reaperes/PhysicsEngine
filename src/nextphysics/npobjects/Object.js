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
   * [0] = x, [1] = y, [2] = z.
   *
   * @property force
   * @type {NP.Vec3}
   */
  this.force = new NP.Vec3();

  /**
   * The velocity of object. Unit is m/s.
   * [0] = x, [1] = y, [2] = z.
   *
   * @property velocity
   * @type {NP.Vec3}
   */
  this.velocity = new NP.Vec3();

  /**
   * Position of object. Unit is m.
   * [0] = x, [1] = y, [2] = z.
   *
   * @property position
   * @type {NP.Vec3}
   */
  this.position = new NP.Vec3();
};

NP.Object.prototype.constructor = NP.Object;


/**
 * Add force, etc.
 *
 * @method add
 */
NP.Object.prototype.add = (function() {
  /**
   * After parsing force object, add force to object.
   *
   * @method addForce
   * @param forces {Object} object of forces
   */
  var addForce = function(forces) {
    var i, len;
    var forcesArr = Object.keys(forces);

    for (i=0, len=forcesArr.length; i<len; i++) {
      if ('gravity' === forcesArr[i]) {
        this.forces['gravity'] = forces[i] === 'default' ? new NP.GravityForce() : new NP.GravityForce(forces[i]);
      }
    }
  };

  return function() {
    var i, len, key;
    for (i=0, len=arguments.length; i<len; i++) {
      for (key in arguments[i]) {
        if (key === 'force') {
          addForce.call(this, arguments[i]['force']);
        }
      }
    }
  };
})();

NP.Object.Type = {
  CIRCLE: 'circle',
  SPHERE: 'sphere'
};

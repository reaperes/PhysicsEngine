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
   * If object can be forced.
   *
   * @type {boolean}
   */
  this.forceFlag = true;

  /**
   * Forces of object
   *
   * @property forces
   * @type Object
   */
  this.forces = {};

  /**
   * Net force of object. Unit is Newton.
   *
   * @property force
   * @type {THREE.Vector3}
   */
  this.force = new THREE.Vector3();

  /**
   * The velocity of object. Unit is m/s.
   * [0] = x, [1] = y, [2] = z.
   *
   * @property velocity
   * @type {THREE.Vector3}
   */
  this.velocity = new THREE.Vector3();

  /**
   * Position of object. Unit is m.
   *
   * @property position
   * @type {THREE.Vector3}
   */
  this.position = new THREE.Vector3();
};

NP.Object.prototype.constructor = NP.Object;

NP.Object.Type = {
  LINE: 'line',
  CIRCLE: 'circle',
  SPHERE: 'sphere'
};

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
        this.forces['gravity'] = new NP.GravityForce(forces[forcesArr[i]]);
        this.forces['gravity'].position = this.position;
      }
      else if ('tension' === forcesArr[i]) {
        this.forces['tension'] = new NP.TensionForce(forces[forcesArr[i]]['pivot'], forces[forcesArr[i]]['object']);
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

/**
 * Update objects
 *
 * @method update
 * @param deltaT {Number} delta time
 */
NP.Object.prototype.update = function(deltaT) {
  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  this.position.x += this.velocity.x * deltaT;
  this.position.y += this.velocity.y * deltaT;
  this.position.z += this.velocity.z * deltaT;
};

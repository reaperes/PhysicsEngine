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

NP.Object.prototype.addForce = function(force) {
  if (force instanceof NP.GravityForce) {
    this.forces[NP.Force.Type.GRAVITY] = force;
  }
};

NP.Object.prototype.solveNetForce = function() {
  var force, netForce = new THREE.Vector3();

  if (this.forces[NP.Force.Type.GRAVITY] !== undefined) {
    force = this.forces[NP.Force.Type.GRAVITY];
    force.update();
    netForce.add(force.vector);
  }
  this.force = netForce;
};

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

NP.Object.prototype.renderScript = function(renderOptions) {
};

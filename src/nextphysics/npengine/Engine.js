/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function() {
  /**
   * objects variable contains npobjects which affected by engine.
   *
   * @property objects
   * @type Array[NP.Object]
   */
  var objects = [];

  /**
   * Add object
   *
   * @method add
   * @param npobject
   */
  this.add = function(npobject) {
    objects.push(npobject)
  };

  /**
   * Add objectContainer to engine
   *
   * @method addContainer
   * @param objectContainer
   */
  this.addContainer = function(objectContainer) {
    var i, len;
    var objects = objectContainer.childs;
    for (i=0, len=objects.length; i<len; i++) {
      this.add(objects[i]);
    }
  };

  /**
   * Update objects
   *
   * @method update
   * @param deltaT {Number} delta time
   */
  this.update = function(deltaT) {
    var i, lenI;

    for (i=0, lenI=objects.length; i<lenI; i++) {
      var object = objects[i];
      if (object.forceFlag) {
        solveNetForce(object);
        object.update(deltaT);
      }
    }
  };

  /**
   * Solve the net force of npobject.
   *
   * @method solveNetForce
   * @param object {NP.Object} object of forces
   */
  var solveNetForce = function(object) {
    var forces = object.forces;
    var keys = Object.keys(forces);
    var len = keys.length;
    if (len == 0) {
      return new THREE.Vector3();
    }
debugger;
    // calculate source forces
    var vector = new THREE.Vector3();
    if (forces[NP.Force.Type.GRAVITY] != undefined) {
      forces[NP.Force.Type.GRAVITY].update();
      vector.add(forces[NP.Force.Type.GRAVITY].vector);
    }
    object.force = vector;

    // calculate reaction forces
    if (forces[NP.Force.Type.TENSION] != undefined) {
      forces[NP.Force.Type.TENSION].update();
      vector.add(forces[NP.Force.Type.TENSION].vector);
    }
    object.force = vector;
  };
};

NP.Engine.prototype.constructor = NP.Engine;

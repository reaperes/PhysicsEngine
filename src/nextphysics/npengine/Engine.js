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
   * @param npobject {NP.Object}
   */
  this.add = function(npobject) {
    objects.push(npobject)
  };

  /**
   * Update objects
   *
   * @method update
   * @param deltaT {Number} delta time
   */
  this.update = function(deltaT) {
    var i, j, lenI, lenJ;

    for (i=0, lenI=objects.length; i<lenI; i++) {
      var object = objects[i];
      var force = object.force = solveNetForce(object.forces);

      var velocity = object.velocity;
      velocity.x += force.x * deltaT;
      velocity.y += force.y * deltaT;
      velocity.z += force.z * deltaT;

      var position = object.position;
      position.x += velocity.x * deltaT;
      position.y += velocity.y * deltaT;
      position.z += velocity.z * deltaT;
    }
  };

  /**
   * Solve the net force of npobject.
   *
   * @method solveNetForce
   * @param forces {Object} object of forces
   * @return {NP.Vec3} net force vector.
   */
  var solveNetForce = function(forces) {
    var keys = Object.keys(forces);
    var len = keys.length;
    if (len == 0) {
      return new NP.Vec3();
    }

    var i;
    var vector = new NP.Vec3();
    for (i=0; i<len; i++) {
      switch (keys[i]) {
        case NP.Force.GRAVITY:
          vector.add(forces[NP.Force.GRAVITY].vector);
          break;
      }
    }

    return vector;
  }
};

NP.Engine.prototype.constructor = NP.Engine;

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
      object.force = solveNetForce(object.forces);

      for (j=0, lenJ=object.force.length; j<lenJ; j++) {
        object.velocity[j] += object.force[j] * deltaT;
      }

      for (j=0, lenJ=object.velocity.length; j<lenJ; j++) {
        object.position[j] += object.velocity[j] * deltaT;
      }
    }
  };

  /**
   * Solve the net force of npobject.
   *
   * @method solveNetForce
   * @param forces {Object} object of forces
   * @return {Array} net force array.
   */
  var solveNetForce = function(forces) {
    var keys = Object.keys(forces);
    var len = keys.length;
    if (len == 0) {
      return [0, 0];
    }

    var i;
    var x = 0, y = 0;
    for (i=0; i<len; i++) {
      switch (keys[i]) {
        case NP.Force.GRAVITY:
          y -= -9.8;
          break;
      }
    }

    return [x, y];
  }
};

NP.Engine.prototype.constructor = NP.Engine;

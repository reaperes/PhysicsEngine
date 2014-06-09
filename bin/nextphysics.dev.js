/**
 * @author namhoon <emerald105@hanmail.net>
 */

NP = {};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
NextPhysics = function (canvas) {
  var engine = new NP.Engine();

  if (canvas === undefined || !(canvas instanceof HTMLCanvasElement)) {
    throw 'HTMLCanvasElement parameter is empty or wrong.';
  }

  this.add = function (arg) {
    var i = 0,
        len = arg && arg.length || 0,
        thing = len ? arg[0] : arg;

    if (!thing) {
      return;
    }

    do {
      engine.add(thing);
    } while (++i < len && (thing = arg[i]));
  };
};

NextPhysics.prototype.constructor = NextPhysics;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function() {
  this.add = function(arg) {
    alert('add object');
  }
};

NP.Engine.prototype.constructor = NP.Engine;

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

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
NextPhysics = function (canvas) {
  if (canvas === undefined || !(canvas instanceof HTMLCanvasElement)) {
    throw 'HTMLCanvasElement parameter is empty or wrong.';
  }

  var engine = new NP.Engine();
  var renderer = new NP.Renderer(canvas);
  var objects = [];

  this.add = function (arg) {
    var i = 0,
        len = arg && arg.length || 0,
        thing = len ? arg[0] : arg;

    if (!thing) {
      return;
    }

    do {
      objects.push(thing);
      engine.add(thing);
    } while (++i < len && (thing = arg[i]));
  };

  this.show = function () {
    renderer.render();
  }
};

NextPhysics.prototype.constructor = NextPhysics;

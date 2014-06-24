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

  /**
   * del
   *
   * @property deltaT
   * @type {Number}
   */
  var deltaT = 0.1;

  /**
   * @method add
   * @param npobject {NP.Object}
   */
  this.add = function (npobject) {
    objects.push(npobject);
    engine.add(npobject);
  };

  /**
   * Updates objects
   *
   * @method update
   */
  this.update = function () {
    engine.update();
  };

  /**
   * Display objects
   *
   * @method render
   */
  this.render = function () {
    for (var i = 0, len = objects.length; i<len; i++) {
      renderer.render(objects[i]);
      // consider priority, camera position
    }
  };

  /**
   * Start engine
   *
   * @method start
   */
  this.start = function() {
    var loop = function() {
      this.update();
      this.render();
      requestAnimationFrame(loop, undefined);
    }.bind(this);

    requestAnimationFrame(loop, undefined);
  };
};

NextPhysics.prototype.constructor = NextPhysics;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvasContainer {HTMLElement}
 * @constructor
 */
NextPhysics = function (canvasContainer) {
  var engine = new NP.Engine();
  var renderer = new NP.Renderer(canvasContainer);

  /**
   * delta time
   *
   * @property deltaT
   * @type {Number}
   */
  var deltaT = 0.01;

  /**
   * Add object
   *
   * @method add
   * @param npobject {NP.Object}
   */
  this.add = function (npobject) {
    if (npobject instanceof NP.ObjectContainer) {
      engine.addContainer(npobject);
      renderer.addContainer(npobject);
    }
    else {
      engine.add(npobject);
      renderer.add(npobject);
    }
  };

  /**
   * Updates objects
   *
   * @method update
   */
  this.update = function () {
    engine.update(deltaT);
  };

  /**
   * Display objects
   *
   * @method render
   */
  this.render = function () {
    renderer.render();
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
      requestAnimationFrame(loop, renderer.canvas);
    }.bind(this);

    var debugLoop = function() {
      stats.begin();
      this.update();
      this.render();
      stats.end();
      requestAnimationFrame(debugLoop, renderer.canvas);
    }.bind(this);

    if (NP.DEBUG) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
      requestAnimationFrame(debugLoop, renderer.canvas);
    }
    else {
      requestAnimationFrame(loop, renderer.canvas);
    }
  };

  /****************************************************
   * Mouse event handling
   ****************************************************/
  canvasContainer.addEventListener('mouseover', function(e) {}.bind(this), false);
  canvasContainer.addEventListener('mousewheel', function(e) {
    if (e.wheelDelta > 0) {
      renderer.camera.position.z -= renderer.camera.position.z / 10;
    }
    else {
      renderer.camera.position.z += renderer.camera.position.z / 10;
    }
  }.bind(this), false);
};

NextPhysics.prototype.constructor = NextPhysics;

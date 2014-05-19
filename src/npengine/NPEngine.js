/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPEngine
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
NPEngine = function(canvas) {
  var state = 'create';     // create, ready, start, resume, pause, stop, destroy

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw 'HTMLCanvasElement parameter is empty or wrong.';
  }

  var objectManager = new NPEngine.ObjectManager();
  var rendererManager = new NPEngine.RendererManager(canvas, objectManager);
  var interactionManager = new NPEngine.InteractionManager(canvas, objectManager, rendererManager);

  /**
   * Add the NPObject to object manager.
   *
   * @method addObject
   * @param npobject {NPObject}
   */
  this.addObject = function(npobject) {
    objectManager.addObject(npobject);
  };



  /**
   * update and render
   * @method updateAndRender
   */
  var updateAndRender = function() {
    objectManager.updateObjects();
    rendererManager.render();
    requestAnimationFrame(updateAndRender, canvas);
  };

  requestAnimationFrame(updateAndRender, canvas); // temp code for test
};

NPEngine.prototype.constructor = NPEngine;

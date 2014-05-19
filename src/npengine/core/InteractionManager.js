/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * The interaction manager deals with mouse and touch events.
 * Any NPObject can be interactive if its interactive property
 * is set to true.
 *
 * @class InteractionManager
 * @constructor
 * @param canvas {HTMLCanvasElement} The view contains NPObjects
 * @param objectManager {NPEngine.ObjectManager}
 * @param rendererManager {NPEngine.RendererManager}
 */
NPEngine.InteractionManager = function(canvas, objectManager, rendererManager) {
  /**
   * @property {Array.<NPEngine.NPObject>} npobjects
   * @readonly
   */
  var npobjects = objectManager.getObjects();

  canvas.addEventListener('mousedown', function(event) {
    wrapEvent(event);

    console.log(event.npx + ', ' + event.npy);
    for (var i= 0, len=npobjects.length; i<len; i++) {debugger;
      if (npobjects[i].interactive && npobjects[i].isObjectEvent(event)) {
        npobjects[i].onMouseDown(event);
      }
    }
  }, false);

  /**
   * convert mouse page position to relative canvas position
   * @method wrapperEvent
   * @private
   */
  var wrapEvent = function(event) {
    // px to npX, npY (meter unit)
    var canvasOffset = canvas.getBoundingClientRect();
    event.npX = (event.pageX - canvasOffset.left) / rendererManager.scale - rendererManager.zeroPoint.x;
    event.npY = (event.pageY - canvasOffset.top) / -rendererManager.scale - rendererManager.zeroPoint.y;
  }
};

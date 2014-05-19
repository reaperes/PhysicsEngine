/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Renderer manager
 *
 * @class NPEngine.RendererManager
 * @param canvas {HTMLCanvasElement}
 * @param objectManager {NPEngine.ObjectManager}
 * @constructor
 */
NPEngine.RendererManager = function(canvas, objectManager) {
  /**
   * @property canvas {HTMLCanvasElement}
   * @readonly
   */
  this.canvas = canvas;

  /**
   * @property npobjects
   * @type {Array.<NPEngine.NPObject>}
   * @readonly
   */
  this.npobjects = objectManager.getObjects();

  /**
   * Theme for design
   * @property renderer
   * @Type NPEngine.CanvasRenderer
   */
  this.theme = new NPEngine.Theme();

  /**
   * render scale
   * @property scale {Number}
   */
  this.scale = 100;

  /**
   * zero coordinate
   * @property zeroPoint {NPEngine.Point}
   */
  this.zeroPoint = new NPEngine.Point(0, 0);

  /**
   * Renderer
   * @property renderer
   * @Type NPEngine.CanvasRenderer
   * @private
   */
  var renderer = new NPEngine.CanvasRenderer(this);

  /**
   * Render
   * @method render
   */
  this.render = function() {
    renderer.render();
  };
};
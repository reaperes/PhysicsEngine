/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * the CanvasRenderer draws the view and all its content onto a 2d canvas.
 * This renderer should be used for browsers that do not support webGL.
 *
 * @class NPEngine.CanvasRenderer
 * @param rendererManager {NPEngine.RendererManager}
 * @constructor
 */
NPEngine.CanvasRenderer = function(rendererManager) {
  /**
   * The canvas 2d context that everything is drawn with
   * @property ctx
   * @type CanvasRenderingContext2D
   */
  var ctx = rendererManager.canvas.getContext('2d');

  /**
   * A class of functions used by the canvas renderer to draw the primitive npobject graphics data
   * @property graphics
   * @type NPEngine.CanvasGraphics
   */
  var graphics = new NPEngine.CanvasGraphics(rendererManager.theme, rendererManager.theme);

  /**
   * Render
   * @method render
   */
  this.render = function() {
    this.clear();
    graphics.renderGraphics(ctx, rendererManager);
  };

  /**
   * Clears the canvas
   * @method clear
   */
  this.clear = function() {
    ctx.save();
    ctx.fillStyle = rendererManager.theme.bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    ctx.restore();
  };
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * A set of functions used by the canvas renderer to draw the primitive npobjects
 *
 * @class NPEngine.CanvasGraphics
 * @constructor
 */
NPEngine.CanvasGraphics = function() {
  /**
   * Renders the npobjects
   *
   * @method renderGraphics
   * @param ctx {CanvasRenderingContext2D} the 2d drawing method of the canvas
   * @param rendererManager {NPEngine.RendererManager} color package
   */
  this.renderGraphics = function(ctx, rendererManager) {
    var scale = rendererManager.scale;
    var theme = rendererManager.theme;
    var npobjects = rendererManager.npobjects;
    var zeroPoint = rendererManager.zeroPoint;

    ctx.save();
    ctx.strokeStyle = theme.strokeStyle;
    for (var i= 0, len= npobjects.length; i<len; i++) {
      var obj = npobjects[i];

      if (obj.type == NPEngine.NPObject.PENDULUM) {
        var pivot = obj.getPivot();
        var circle = obj.getCircle();

        ctx.beginPath();
        ctx.lineWidth = obj.getLine().lineWidth;
        ctx.moveTo(zeroPoint.x+pivot.x*scale, zeroPoint.y-pivot.y*scale);
        ctx.lineTo(zeroPoint.x+circle.x*scale, zeroPoint.y-circle.y*scale);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(zeroPoint.x+circle.x*scale, zeroPoint.y-circle.y*scale, circle.radius*scale, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
      } else {
        throw new Error('NPObject type does not match.');
      }
    }
    ctx.restore();
  }
};
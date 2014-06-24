/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Renderer
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
NP.Renderer = function(canvas) {
  var ctx = canvas.getContext('2d');

  /**
   * Render objects
   *
   * @method render
   * @param object {NP.Object} render object
   */
  this.render = function(object) {
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();
  }
};

NP.Renderer.prototype.constructor = NP.Renderer;

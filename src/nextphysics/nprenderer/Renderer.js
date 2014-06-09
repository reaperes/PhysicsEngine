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

  this.render = function() {
    ctx.arc();
  }
};

NP.Renderer.prototype.constructor = NP.Renderer;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Interface of nprenderer
 *
 * @class NP.Renderer
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer = function(canvasContainer) {
  // auto detect 2d or 3d renderer
//  return new NP.Renderer2D(canvasContainer);
  return new NP.Renderer3D(canvasContainer);
};

NP.Renderer.prototype.constructor = NP.Renderer;


/**
 * Render objects
 *
 * @method render
 */
NP.Renderer.prototype.render = function() {
  alert('error');
};

/**
 * Add object to renderer scene
 *
 * @method add
 * @param object {NP.Object}
 */
NP.Renderer.prototype.add = function(object) {
  alert('error');
};

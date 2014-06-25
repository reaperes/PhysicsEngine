/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Renderer2D
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer2D = function(canvasContainer) {
  /**
   * Array of rendered object.
   * Render starts index 0 to last index.
   *
   * @property objects
   * @type Array[NP.Object]
   */
  var objects = [];

  /**
   * Two.js property
   *
   * @property two
   */
  var two = new Two({
    width: canvasContainer.offsetWidth,
    height: canvasContainer.offsetHeight
  }).appendTo(canvasContainer);

  // find color set
  var colorSet = NP.ColorSets[0];
  canvasContainer.style.background = colorSet['background'];

  /**
   * Render objects
   *
   * @method render
   */
  this.render = function() {
    two.update();
  };

  /**
   * Add object to renderer scene
   *
   * @method add
   * @param object one of npobject
   */
  this.add = function(object) {
    switch (object.type) {
      case NP.Object.Type.CIRCLE:
//        var circle = two.makeCircle(object.position[0], object.position[1], object.radius);
        var circle = two.makeCircle(100, 100, 20);
        circle.fill = colorSet['color1'];
        circle.noStroke();
        break;
    }
  }
};

NP.Renderer2D.prototype = Object.create(NP.Renderer.prototype);
NP.Renderer2D.prototype.constructor = NP.Renderer2D;

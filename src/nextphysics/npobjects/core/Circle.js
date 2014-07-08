/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Circle
 * @constructor
 */
NP.Circle = function(x, y, z, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.CIRCLE;

  this.position.x = x !== undefined ? x : 0;
  this.position.y = y !== undefined ? y : 0;
  this.position.z = z !== undefined ? z : 0;
  this.radius = radius !== undefined ? radius : 1;
};

NP.Circle.prototype = Object.create(NP.Object.prototype);
NP.Circle.prototype.constructor = NP.Circle;

NP.Circle.prototype.renderScript = function(scene, renderOptions) {
  var segments = renderOptions['segments'] !== undefined ? renderOptions['segments'] : 32;
  var geometry = new THREE.CircleGeometry( this.radius, segments );
  var material = new THREE.MeshBasicMaterial({
    color: renderOptions['color1'] !== undefined ? renderOptions['color1'] : NP.ColorSets[0]['color1']
  });

  var circle = new THREE.Mesh(geometry, material);
  circle.position = this.position;
  scene.add(circle);
};

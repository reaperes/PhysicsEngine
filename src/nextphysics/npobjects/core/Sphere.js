/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Sphere
 * @constructor
 */
NP.Sphere = function(x, y, z, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.SPHERE;

  this.position.x = x !== undefined ? x : 0;
  this.position.y = y !== undefined ? y : 0;
  this.position.z = z !== undefined ? z : 0;
  this.radius = radius !== undefined ? radius : 1;
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

NP.Sphere.prototype.renderScript = function(scene, renderOptions) {
  var segments = renderOptions['segments'] !== undefined ? renderOptions['segments'] : 32;

  var geometry = new THREE.SphereGeometry(this.radius, segments, segments);
  var material = new THREE.MeshBasicMaterial({
    color: renderOptions['color1'] !== undefined ? renderOptions['color1'] : NP.ColorSets[0]['color1'],
    wireframe: true
  });
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position = this.position;
  scene.add(sphere);
};

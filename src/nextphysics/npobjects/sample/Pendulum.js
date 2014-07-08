/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Pendulum
 * @constructor
 */
NP.Pendulum = function(circle, pivot) {
  NP.Object.call(this);

  this.circle = circle !== undefined ? circle : new NP.Circle();
  this.pivot = pivot !== undefined ? pivot : new THREE.Vector3(0, 4, 0);
  this.lineLength = this.pivot.distanceTo(circle.pivot);

  this.position = this.pivot;
};

NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype);
NP.Pendulum.prototype.constructor = NP.Pendulum;


NP.Pendulum.prototype.renderScript = function(scene, renderOptions, updateFunctions) {
  var lineMaterial = new THREE.LineBasicMaterial({
    color: renderOptions['color1'] !== undefined ? renderOptions['color1'] : NP.ColorSets[0]['color1'],
    linewidth: 2
  });

  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(this.pivot);
  lineGeometry.vertices.push(this.circle.position);

  var line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  var segments = renderOptions['segments'] !== undefined ? renderOptions['segments'] : 32;
  var sphereGeometry = new THREE.SphereGeometry(this.circle.radius, segments, segments);
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: renderOptions['color1'] !== undefined ? renderOptions['color1'] : NP.ColorSets[0]['color1'],
    wireframe: true
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position = this.circle.position;
  scene.add(sphere);

  updateFunctions.push(function() {
    lineGeometry.verticesNeedUpdate = true;
  });
};

NP.Pendulum.prototype.solveNetForce = function() {
  var force, netForce = new THREE.Vector3();

  if (this.forces[NP.Force.Type.GRAVITY] !== undefined) {
    force = this.forces[NP.Force.Type.GRAVITY];
    force.update();
    netForce.add(force.vector);
  }

  // todo : lineLength check

  this.force = netForce;
};

NP.Pendulum.prototype.update = function(deltaT) {
  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  this.circle.position.x += this.velocity.x * deltaT;
  this.circle.position.y += this.velocity.y * deltaT;
  this.circle.position.z += this.velocity.z * deltaT;
};

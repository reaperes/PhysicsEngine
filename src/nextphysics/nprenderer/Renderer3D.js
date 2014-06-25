/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Renderer3D
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer3D = function(canvasContainer) {
  var renderer = new THREE.WebGLRenderer();
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 1, 100);

  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);
  scene.add(camera);

  var axes = new THREE.AxisHelper( 100 );
  scene.add(axes);

  /**
   * Render objects
   *
   * @method render
   */
  this.render = function() {
    renderer.render(scene, camera);
  };

  /**
   * Add object to renderer scene
   *
   * @method add
   * @param object {NP.Object}
   */
  this.add = function(object) {
    switch (object.type) {
      case NP.Object.Type.CIRCLE:

        var sphereGeometry = new THREE.SphereGeometry(1, 15, 15);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

        // position the sphere
        sphere.position.x=0;
        sphere.position.y=0;
        sphere.position.z=0;
        scene.add(sphere);

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        camera.lookAt(scene.position);

        break;
    }
  };
};

NP.Renderer3D.prototype = Object.create(NP.Renderer.prototype);
NP.Renderer3D.prototype.constructor = NP.Renderer3D;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Next physics renderer
 *
 * @class NP.Renderer
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer = function(canvasContainer) {
  var renderer = new THREE.WebGLRenderer();
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.0001, 100000);
  var colorSet = NP.ColorSets[0];

  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);
  scene.add(camera);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;
  camera.lookAt(scene.position);

  var axes = new THREE.AxisHelper( 100 );
  scene.add(axes);

  /**
   * Renderer camera
   *
   * @property camera
   */
  this.camera = camera;

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
    var segments = 16;

    switch (object.type) {
      case NP.Object.Type.CIRCLE:
        var circleGeometry = new THREE.CircleGeometry( object.radius, segments );
        var material = new THREE.MeshBasicMaterial({color: colorSet['color1']});
        var circle = new THREE.Mesh( circleGeometry, material );

        circle.position.x = object.x;
        circle.position.y = object.y;
        scene.add( circle );
        break;

      case NP.Object.Type.SPHERE:
        var sphereGeometry = new THREE.SphereGeometry(object.radius, segments, segments);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: colorSet['color1'], wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = object.x;
        sphere.position.y = object.y;
        sphere.position.z = object.z;
        scene.add(sphere);
        break;
    }
  };
};

NP.Renderer.prototype.constructor = NP.Renderer;

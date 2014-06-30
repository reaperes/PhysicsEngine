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
  var objects = [];

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
   * Renderer canvas
   *
   * @property canvas
   */
  this.canvas = renderer.domElement;

  /**
   * Render objects
   *
   * @method render
   */
  this.render = function() {
    syncObjects();
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

        circle.position.x = object.position.x;
        circle.position.y = object.position.y;
        circle.position.z = object.position.z;
        scene.add( circle );

        objects.push([object, circle.position]);
        break;

      case NP.Object.Type.SPHERE:
        var sphereGeometry = new THREE.SphereGeometry(object.radius, segments, segments);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: colorSet['color1'], wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = object.position.x;
        sphere.position.y = object.position.y;
        sphere.position.z = object.position.z;
        scene.add(sphere);

        objects.push([object, sphere.position]);
        break;
    }
  };

  var syncObjects = function() {
    var i, len;

    for (i=0, len=objects.length; i<len; i++) {
      var objectPair = objects[i];
      var object = objectPair[0];
      var three = objectPair[1];


      three.x = object.position.x;
      three.y = object.position.y;
      three.z = object.position.z;
      console.log(three.x + ', ' + three.y + ', ' + three.z);
      debugger;
    }
  }
};

NP.Renderer.prototype.constructor = NP.Renderer;

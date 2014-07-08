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
  var updateFunctions = [];

  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);
  scene.add(camera);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 15;
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
    var i, len;
    for (i=0, len=updateFunctions.length; i<len; i++) {
      updateFunctions[i].call(this);
    }
    renderer.render(scene, camera);
  };

  /**
   * Add object to renderer scene
   *
   * @method add
   * @param object {NP.Object}
   */
  this.add = function(object) {
    var renderOptions = {
      segments: 16,
      color1: colorSet['color1']
    };

    object.renderScript(scene, renderOptions, updateFunctions);
  };

//    var segments = 16;
//    var material;
//
//    switch (object.type) {
//      case NP.Object.Type.LINE:
//        material = new THREE.LineBasicMaterial({
//          color: colorSet['color1']
//        });
//
//        var geometry = new THREE.Geometry();
//        geometry.vertices.push(object.position);
//        geometry.vertices.push(object.v2);
//
//        var line = new THREE.Line(geometry, material);
//        scene.add(line);
//
//        updateFunctions.push(function() {
//          geometry.verticesNeedUpdate = true;
//        });
//        break;
//
//      case NP.Object.Type.SPHERE:
//        geometry = new THREE.SphereGeometry(object.radius, segments, segments);
//        material = new THREE.MeshBasicMaterial({color: colorSet['color1'], wireframe: true});
//        var sphere = new THREE.Mesh(geometry, material);
//
//        sphere.position = object.position;
//        scene.add(sphere);
//        break;
//    }
//  };
//
//  /**
//   * Add objectContainer to renderer scene
//   *
//   * @method addContainer
//   * @param objectContainer
//   */
//  this.addContainer = function(objectContainer) {
//    var i, len;
//    var objects = objectContainer.childs;
//    for (i=0, len=objects.length; i<len; i++) {
//      this.add(objects[i]);
//    }
//  };
};

NP.Renderer.prototype.constructor = NP.Renderer;

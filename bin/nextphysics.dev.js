/**
 * @author namhoon <emerald105@hanmail.net>
 */

NP = {};
NP.DEBUG = true;















// ONLY FOR DEBUGGING TOOLS
if (NP.DEBUG) {
  NP.DEBUG_KEY = 'debug_key';
  NP.DEBUG_VALUE = 'debug_value';

  var _debug_container = document.createElement('div');
  _debug_container.id = 'debug';
  _debug_container.style.cssText = 'width:0px;height:0px;opacity:0.9;';

  var _debug_addKey = function (key, value) {
    var el = document.createElement('span');
    el.id = 'debug_key';
    el.style.cssText = 'width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:50px;left:0px;position:absolute;padding-left:10px;';
    el.textContent = key;
    _debug_container.appendChild(el);

    var el2 = document.createElement('span');
    el2.id = 'debug_key';
    el2.style.cssText = 'width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:70px;left:0px;position:absolute;padding-left:10px;';
    el2.textContent = value;
    _debug_container.appendChild(el2);
  };

  window.onload = function() {
    document.body.appendChild(_debug_container);
  }
}
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Utility class
 *
 * @class NP.Util
 * @constructor
 */
NP.Util = function() {
  /**
   *  return if it is integer
   *
   *  @method isInt
   *  @param n
   *  @return {boolean}
   */
  this.isInt = function(n) {
    return typeof n === 'number' && n % 1 === 0;
  };

//  /**
//   *  Convert int to float number
//   *
//   *  @method intToFloat
//   *  @param n {number}
//   *  @return {number} float number
//   */
//  this.intToFloat = function(n) {
//    var f:float = n;
//    return f;
//  }
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Vec3
 * @constructor
 */
NP.Vec3 = function(x, y, z) {
  return new THREE.Vector3(x, y, z);
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvasContainer {HTMLElement}
 * @constructor
 */
NextPhysics = function (canvasContainer) {
  var engine = new NP.Engine();
  var renderer = new NP.Renderer(canvasContainer);

  /**
   * delta time
   *
   * @property deltaT
   * @type {Number}
   */
  var deltaT = 0.01;

  /**
   * Add object
   *
   * @method add
   * @param npobject {NP.Object}
   */
  this.add = function (npobject) {
    engine.add(npobject);
    renderer.add(npobject);
  };

  /**
   * Updates objects
   *
   * @method update
   */
  this.update = function () {
    engine.update(deltaT);
  };

  /**
   * Display objects
   *
   * @method render
   */
  this.render = function () {
    renderer.render();
  };

  /**
   * Start engine
   *
   * @method start
   */
  this.start = function() {
    var loop = function() {
      this.update();
      this.render();
      requestAnimationFrame(loop, renderer.canvas);
    }.bind(this);

    var debugLoop = function() {
      stats.begin();
      this.update();
      this.render();
      stats.end();
      requestAnimationFrame(debugLoop, renderer.canvas);
    }.bind(this);

    if (NP.DEBUG) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
      requestAnimationFrame(debugLoop, renderer.canvas);
    }
    else {
      requestAnimationFrame(loop, renderer.canvas);
    }
  };

  /****************************************************
   * Mouse event handling
   ****************************************************/
  canvasContainer.addEventListener('mouseover', function(e) {}.bind(this), false);
  canvasContainer.addEventListener('mousewheel', function(e) {
    if (e.wheelDelta > 0) {
      renderer.camera.position.z -= renderer.camera.position.z / 10;
    }
    else {
      renderer.camera.position.z += renderer.camera.position.z / 10;
    }
  }.bind(this), false);
};

NextPhysics.prototype.constructor = NextPhysics;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function() {
  /**
   * objects variable contains npobjects which affected by engine.
   *
   * @property objects
   * @type Array[NP.Object]
   */
  var objects = [];

  /**
   * Add object
   *
   * @method add
   * @param npobject
   */
  this.add = function(npobject) {
    objects.push(npobject)
  };

  /**
   * Add objectContainer to engine
   *
   * @method addContainer
   * @param objectContainer
   */
  this.addContainer = function(objectContainer) {
    var i, len;
    var objects = objectContainer.childs;
    for (i=0, len=objects.length; i<len; i++) {
      this.add(objects[i]);
    }
  };

  /**
   * Update objects
   *
   * @method update
   * @param deltaT {Number} delta time
   */
  this.update = function(deltaT) {
    var i, lenI;

    for (i=0, lenI=objects.length; i<lenI; i++) {
      var object = objects[i];
      if (object.forceFlag) {
        object.solveNetForce();
        object.update(deltaT);
      }
    }
  };



//    var forces = object.forces;
//    var keys = Object.keys(forces);
//    var len = keys.length;
//    if (len == 0) {
//      return new THREE.Vector3();
//    }
//
//    // calculate source forces
//    var vector = new THREE.Vector3();
//    if (forces[NP.Force.Type.GRAVITY] != undefined) {
//      forces[NP.Force.Type.GRAVITY].update();
//      vector.add(forces[NP.Force.Type.GRAVITY].vector);
//    }
//    object.force = vector;
//
//    // calculate reaction forces
//    if (forces[NP.Force.Type.TENSION] != undefined) {
//      forces[NP.Force.Type.TENSION].update();
//      vector.add(forces[NP.Force.Type.TENSION].vector);
//    }
//    object.force = vector;
//  };
};

NP.Engine.prototype.constructor = NP.Engine;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.ElasticForce
 * @constructor
 */
//NP.ElasticForce = function(gravity) {
//  NP.Force.call(this);
//
//};
//
//NP.ElasticForce.prototype = Object.create(NP.Force.prototype);
//NP.ElasticForce.prototype.constructor = NP.ElasticForce;
//
//NP.ElasticForce.prototype.update = function() {
//  return this.vector;
//};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function() {
  this.position = new THREE.Vector3();
  this.vector = new THREE.Vector3();
};

NP.Force.prototype.constructor = NP.Force;

NP.Force.Type = {
  GRAVITY: 'gravity',
  TENSION: 'tension'
};

/**
 * Convert to Array list
 *
 * @method list
 */
NP.Force.prototype.list = function() {
  return this.vector.list();
};

/**
 * Update force
 *
 * @method update
 */
NP.Force.prototype.update = function() {
  throw new Error('Update function must be override.');
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.GravityForce
 * @constructor
 */
NP.GravityForce = function(gravity) {
  NP.Force.call(this);

  gravity = gravity || 9.8;
  this.__defineGetter__('gravity', function() {
    return gravity;
  });
  this.__defineSetter__('gravity', function(value) {
    gravity = value;
    this.vector.y = -value;
  });

  this.vector.x = 0;
  this.vector.y = -gravity;
  this.vector.z = 0;
};

NP.GravityForce.prototype = Object.create(NP.Force.prototype);
NP.GravityForce.prototype.constructor = NP.GravityForce;

NP.GravityForce.prototype.update = function() {
  // gravitational force is constant.
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.TensionForce
 * @constructor
 * @param pivot {THREE.Vector3} the point of pivot
 * @param object {NP.Object}
 */
NP.TensionForce = function(pivot, object) {
  NP.Force.call(this);

  this.pivot = pivot !== undefined ? pivot : new THREE.Vector3();
  this.object = object !== undefined ? object : new NP.Object();
};

NP.TensionForce.prototype = Object.create(NP.Force.prototype);
NP.TensionForce.prototype.constructor = NP.TensionForce;

NP.TensionForce.prototype.update = function() {
  var distanceToObject = this.pivot.distanceTo(this.object.position);
  var cosTheta = Math.abs(this.object.position.y - this.pivot.y) / distanceToObject;
  this.vector = this.object.force.clone().multiplyScalar(-cosTheta);
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Everything can be on canvas is inherited NP.Object
 *
 * @class NP.Object
 * @constructor
 */
NP.Object = function() {
  /**
   * Type of object
   *
   * @property type
   * @type NP.Object.Type
   */
  this.type = undefined;

  /**
   * If object can be forced.
   *
   * @type {boolean}
   */
  this.forceFlag = true;

  /**
   * Forces of object
   *
   * @property forces
   * @type Object
   */
  this.forces = {};

  /**
   * Net force of object. Unit is Newton.
   *
   * @property force
   * @type {THREE.Vector3}
   */
  this.force = new THREE.Vector3();

  /**
   * The velocity of object. Unit is m/s.
   * [0] = x, [1] = y, [2] = z.
   *
   * @property velocity
   * @type {THREE.Vector3}
   */
  this.velocity = new THREE.Vector3();

  /**
   * Position of object. Unit is m.
   *
   * @property position
   * @type {THREE.Vector3}
   */
  this.position = new THREE.Vector3();
};

NP.Object.prototype.constructor = NP.Object;

NP.Object.Type = {
  LINE: 'line',
  CIRCLE: 'circle',
  SPHERE: 'sphere'
};

NP.Object.prototype.addForce = function(force) {
  if (force instanceof NP.GravityForce) {
    this.forces[NP.Force.Type.GRAVITY] = force;
  }
};

NP.Object.prototype.solveNetForce = function() {
  var force, netForce = new THREE.Vector3();

  if (this.forces[NP.Force.Type.GRAVITY] !== undefined) {
    force = this.forces[NP.Force.Type.GRAVITY];
    force.update();
    netForce.add(force.vector);
  }
  this.force = netForce;
};

/**
 * Update objects
 *
 * @method update
 * @param deltaT {Number} delta time
 */
NP.Object.prototype.update = function(deltaT) {
  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  this.position.x += this.velocity.x * deltaT;
  this.position.y += this.velocity.y * deltaT;
  this.position.z += this.velocity.z * deltaT;
};

NP.Object.prototype.renderScript = function(renderOptions) {
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * NP.ObjectContainer can contains every NP.Object
 *
 * @class NP.ObjectContainer
 * @constructor
 */
NP.ObjectContainer = function() {
  NP.Object.call(this);

  /**
   * The list of contained object.
   *
   * @type {Array}
   */
  this.childs = [];
};

NP.ObjectContainer.prototype = Object.create(NP.Object.prototype);
NP.ObjectContainer.prototype.constructor = NP.ObjectContainer;

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
  this.force = netForce;
};

NP.Pendulum.prototype.update = function(deltaT) {debugger;
  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  this.circle.position.x += this.velocity.x * deltaT;
  this.circle.position.y += this.velocity.y * deltaT;
  this.circle.position.z += this.velocity.z * deltaT;
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Objects color set for renderer.
 *
 * @class NP.ColorSets
 * @constructor
 */
NP.ColorSets = (function() {
  /**
   * Samples of color sets from Adobe Kuler.
   *
   * Color set sample object:
   *
   * {
   *   background: '#FFFFFF',
   *   color1: '#FFFFFF',
   *   color2: '#FFFFFF',
   *   color3: '#FFFFFF',
   *   color4: '#FFFFFF'
   * }
   *
   */

  /**
   * 'Flat Design Colors v2'
   * https://kuler.adobe.com/Copy-of-Flat-Design-Colors-v2-color-theme-3936285/
   */
  var Flat_Design_Colors_v2 = {
    background: 0xFFFFFF,
    color1: 0xDF4949,
    color2: 0xE27A3F,
    color3: 0xEFC94C,
    color4: 0x45B29D,
    color5: 0x334D5C
  };

  /**
   * return color sets
   */
  return [
    Flat_Design_Colors_v2
  ];
})();
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

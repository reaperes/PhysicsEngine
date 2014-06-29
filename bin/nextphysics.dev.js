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
  var deltaT = 0.1;

  /**
   * Set Physics dimension.
   *
   * @method add
   * @param value {String} '2d' or '3d'. Default is '2d'.
   */
  this.setDimension = function(value) {
    if (value === '2d' || value === '3d') {
      NP.dimension = value;
    }
    else {
      NP.dimension = '2d';
    }
  };

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
      requestAnimationFrame(loop, undefined);
    }.bind(this);

    var debugLoop = function() {
      stats.begin();
      this.update();
      this.render();
      stats.end();
      requestAnimationFrame(debugLoop, undefined);
    }.bind(this);

    if (NP.DEBUG) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
      requestAnimationFrame(debugLoop, undefined);
    }
    else {
      requestAnimationFrame(loop, undefined);
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
    console.log(renderer.camera.position.z);
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
   * @param npobject {NP.Object}
   */
  this.add = function(npobject) {
    objects.push(npobject)
  };

  /**
   * Update objects
   *
   * @method update
   * @param deltaT {Number} delta time
   */
  this.update = function(deltaT) {
    var i, j, lenI, lenJ;

    for (i=0, lenI=objects.length; i<lenI; i++) {
      var object = objects[i];
      object.force = solveNetForce(object.forces);

      for (j=0, lenJ=object.force.length; j<lenJ; j++) {
        object.velocity[j] += object.force[j] * deltaT;
      }

      for (j=0, lenJ=object.velocity.length; j<lenJ; j++) {
        object.position[j] += object.velocity[j] * deltaT;
      }
    }
  };

  /**
   * Solve the net force of npobject.
   *
   * @method solveNetForce
   * @param forces {Object} object of forces
   * @return {Array} net force array.
   */
  var solveNetForce = function(forces) {
    var keys = Object.keys(forces);
    var len = keys.length;
    if (len == 0) {
      return [0, 0];
    }

    var i;
    var x = 0, y = 0;
    for (i=0; i<len; i++) {
      switch (keys[i]) {
        case NP.Force.GRAVITY:
          y -= -9.8;
          break;
      }
    }

    return [x, y];
  }
};

NP.Engine.prototype.constructor = NP.Engine;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Force
 * @constructor
 */
NP.Force = function() {
  this.x = 0;
  this.y = 0;
};

NP.Force.prototype.constructor = NP.Force;

NP.Force.GRAVITY = 'gravity';

/**
 * Convert to Array list
 *
 * @method list
 */
NP.Force.prototype.list = function() {
  this.list = function() {
    return [this.x, this.y];
  };
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
    this.y = -value;
  });

  this.x = 0;
  this.y = -9.8;
};

NP.GravityForce.prototype = Object.create(NP.Force.prototype);
NP.GravityForce.prototype.constructor = NP.GravityForce;

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
   * Forces of object
   *
   * @property forces
   * @type Object
   */
  this.forces = {};

  /**
   * Net force of object. Unit is Newton.
   * [0] = x, [1] = y.
   *
   * @property force
   * @type Array[Number]
   */
  this.force = [0, 0];

  /**
   * The velocity of object. Unit is m/s.
   * [0] = x, [1] = y.
   *
   * @property velocity
   * @type Array[Number]
   */
  this.velocity = [0, 0];

  /**
   * Position of object. Unit is m.
   * [0] = x, [1] = y.
   *
   * @property position
   * @type Array[Number]
   */
  this.position = [0, 0];
};

NP.Object.prototype.constructor = NP.Object;


/**
 * Add force, etc.
 *
 * @method add
 */
NP.Object.prototype.add = (function() {
  /**
   * After parsing force object, add force object, and calculate net force of this object.
   *
   * @method addForce
   * @param forces {Object} object of forces
   */
  var addForce = function(forces) {
    var i, len;

    for (i=0, len=Object.keys(forces).length; i<len; i++) {
      if ('gravity' === forces[i]) {
        this.forces['gravity'] = forces[i] === 'default' ? new NP.GravityForce() : new NP.GravityForce(forces[i]);
      }
    }
  };

  return function() {
    var i, len, key;
    for (i=0, len=arguments.length; i<len; i++) {
      for (key in arguments[i]) {
        if (key === 'force') {
          addForce(arguments[i]['force']);
        }
      }
    }
  }
})();

NP.Object.Type = {
  CIRCLE: 'circle',
  SPHERE: 'sphere'
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
};

NP.ObjectContainer.prototype = Object.create(NP.Object.prototype);
NP.ObjectContainer.prototype.constructor = NP.ObjectContainer;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Point
 * @constructor
 */
NP.Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;

  /**
   * Convert to Array list
   *
   * @method list
   */
  this.list = function() {
    return [this.x, this.y];
  }
};

NP.Point.prototype.constructor = NP.Point;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Circle
 * @constructor
 */
NP.Circle = function(x, y, radius) {
  NP.Object.call(this);
  this.type = NP.Object.Type.CIRCLE;

  this.x = x !== undefined ? x : this.x;
  this.y = y !== undefined ? y : this.y;
  this.radius = radius !== undefined ? radius : this.radius;
};

NP.Circle.prototype = Object.create(NP.Object.prototype);
NP.Circle.prototype.constructor = NP.Circle;

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

  this.x = x !== undefined ? x : this.x;
  this.y = y !== undefined ? y : this.y;
  this.z = z !== undefined ? z : this.z;
  this.radius = radius !== undefined ? radius : this.radius;
};

NP.Sphere.prototype = Object.create(NP.Object.prototype);
NP.Sphere.prototype.constructor = NP.Sphere;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Pendulum
 * @constructor
 */
NP.Pendulum = function() {
  NP.ObjectContainer.call(this);
};

NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype);
NP.Pendulum.prototype.constructor = NP.Pendulum;

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

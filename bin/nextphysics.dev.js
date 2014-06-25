/**
 * @author namhoon <emerald105@hanmail.net>
 */

NP = {};
NP.DEBUG = true;
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

NP.Object.Type = {};
NP.Object.Type.CIRCLE = 'circle';
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.ObjectContainer
 * @constructor
 *
 * NP.ObjectContainer can contains every NP.Object
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

  this.x = x !== undefined ? this.x : x;
  this.y = y !== undefined ? this.y : y;
  this.radius = radius !== undefined ? this.radius : radius;
};

NP.Circle.prototype = Object.create(NP.Object.prototype);
NP.Circle.prototype.constructor = NP.Circle;

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
    background: '#FFFFFF',
    color1: '#DF4949',
    color2: '#E27A3F',
    color3: '#EFC94C',
    color4: '#45B29D',
    color5: '#334D5C'
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
 * Interface of nprenderer
 *
 * @class NP.Renderer
 * @constructor
 * @param canvasContainer {HTMLDivElement}
 */
NP.Renderer = function(canvasContainer) {
  // auto detect 2d or 3d renderer
//  return new NP.Renderer2D(canvasContainer);
  return new NP.Renderer3D(canvasContainer);
};

NP.Renderer.prototype.constructor = NP.Renderer;


/**
 * Render objects
 *
 * @method render
 */
NP.Renderer.prototype.render = function() {
  alert('error');
};

/**
 * Add object to renderer scene
 *
 * @method add
 * @param object {NP.Object}
 */
NP.Renderer.prototype.add = function(object) {
  alert('error');
};

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

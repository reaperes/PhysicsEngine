/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPEngine
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
NPEngine = function(canvas) {
  var state = 'create';     // create, ready, start, resume, pause, stop, destroy

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw 'HTMLCanvasElement parameter is empty or wrong.';
  }

  var objectManager = new NPEngine.ObjectManager();
  var rendererManager = new NPEngine.RendererManager(canvas, objectManager);
  var interactionManager = new NPEngine.InteractionManager(canvas, objectManager, rendererManager);

  /**
   * Add the NPObject to object manager.
   *
   * @method addObject
   * @param npobject {NPObject}
   */
  this.addObject = function(npobject) {
    objectManager.addObject(npobject);
  };

  /**
   * update and render
   * @method updateAndRender
   */
  var updateAndRender = function() {
    objectManager.updateObjects();
    rendererManager.render();
    requestAnimationFrame(updateAndRender, canvas);
  };

  requestAnimationFrame(updateAndRender, canvas); // temp code for test
};

NPEngine.prototype.constructor = NPEngine;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * the set of math equation
 * @class NPEngine.NPMath
 * @constructor
 */
NPEngine.NPMath = function() {
};

NPEngine.NPMath.prototype = {
  constructor: NPEngine.NPMath
};


/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * The interaction manager deals with mouse and touch events.
 * Any NPObject can be interactive if its interactive property
 * is set to true.
 *
 * @class InteractionManager
 * @constructor
 * @param canvas {HTMLCanvasElement} The view contains NPObjects
 * @param objectManager {NPEngine.ObjectManager}
 * @param rendererManager {NPEngine.RendererManager}
 */
NPEngine.InteractionManager = function(canvas, objectManager, rendererManager) {
  /**
   * @property {Array.<NPEngine.NPObject>} npobjects
   * @readonly
   */
  var npobjects = objectManager.getObjects();

  canvas.addEventListener('mousedown', function(event) {
    wrapEvent(event);

    console.log(event.canvasX + ', ' + event.canvasY);
    for (var i= 0, len=npobjects.length; i<len; i++) {debugger;
      if (npobjects[i].interactive && npobjects[i].isObjectEvent(event)) {
        npobjects[i].onMouseDown(event);
      }
    }
  }, false);

  /**
   * convert mouse page position to relative canvas position
   * @method wrapperEvent
   * @private
   */
  var wrapEvent = function(event) {
    // px to meter
    var canvasOffset = canvas.getBoundingClientRect();
    event.canvasX = (event.pageX - canvasOffset.left) / rendererManager.scale - rendererManager.zeroPoint.x;
    event.canvasY = (event.pageY - canvasOffset.top) / -rendererManager.scale - rendererManager.zeroPoint.y;
  }
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * The NPObject manager deals with NPObjects.
 *
 * @class NPEngine.ObjectManager
 * @constructor
 */
NPEngine.ObjectManager = function() {
  /**
   * NPObjects data
   * @param npobject {Array.<NPEngine.NPObject>}
   */
  var npobjects = [];

  /**
   * push the NPObject
   * @method addObject
   * @param npobject {NPObject}
   */
  this.addObject = function(npobject) {
    npobjects.push(npobject);
  };

  /**
   * return NPObjects
   *
   * @method addObject
   * @return {Array.<NPEngine.NPObject>} npobjects
   */
  this.getObjects = function() {
    return npobjects;
  };

  /**
   * update npobjects
   * @method updateObjects
   */
  this.updateObjects = function() {
    for (var i= 0, len=npobjects.length; i<len; i++) {
      npobjects[i].update();
    }
  };
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Renderer manager
 *
 * @class NPEngine.RendererManager
 * @param canvas {HTMLCanvasElement}
 * @param objectManager {NPEngine.ObjectManager}
 * @constructor
 */
NPEngine.RendererManager = function(canvas, objectManager) {
  /**
   * @property canvas {HTMLCanvasElement}
   * @readonly
   */
  this.canvas = canvas;

  /**
   * @property npobjects
   * @type {Array.<NPEngine.NPObject>}
   * @readonly
   */
  this.npobjects = objectManager.getObjects();

  /**
   * Theme for design
   * @property renderer
   * @Type NPEngine.CanvasRenderer
   */
  this.theme = new NPEngine.Theme();

  /**
   * render scale
   * @property scale {Number}
   */
  this.scale = 100;

  /**
   * zero coordinate
   * @property zeroPoint {NPEngine.Point}
   */
  this.zeroPoint = new NPEngine.Point(0, 0);

  /**
   * Renderer
   * @property renderer
   * @Type NPEngine.CanvasRenderer
   * @private
   */
  var renderer = new NPEngine.CanvasRenderer(this);

  /**
   * Render
   * @method render
   */
  this.render = function() {
    renderer.render();
  };
};
/**
 * Theme for design
 * @class NPEngine.Theme
 * @constructor
 */
NPEngine.Theme = function() {
  this.bgColor = 'rgb(250, 250, 250)';
  this.strokeStyle = 'black';
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPObject
 * @constructor
 */
NPEngine.NPObject = function() {
  /**
   * Whether or not the object is interactive
   * @property interactive
   * @type Boolean
   */
  this.interactive = false;

  /**
   * Pendulum. Type of npobject list.
   * @static
   * @property type
   */
  this.PENDULUM = 1;
};

NPEngine.NPObject.prototype = {
  constructor: NPEngine.NPObject,

  /**
   * check event is belong to target NPObject
   * @param event {MouseEvent}
   */
  isObjectEvent: function(event) {
    throw new Error('Interactive npobject must override isObjectEvent method');
  },

  /**
   * callback method for mouse down event
   * @param event {MouseEvent}
   */
  onMouseDown: function(event) {
    throw new Error('Interactive npobject must override onMouseDown method.');
  }
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPEngine.Circle
 * @constructor
 * @param x {Number} The X coordinate of the center of this circle
 * @param y {Number} The Y coordinate of the center of this circle
 * @param radius {Number} The radius of the circle
 */
NPEngine.Circle = function(x, y, radius) {
  /**
   * @property x
   * @type Number
   * @default 0
   */
  this.x = x || 0;

  /**
   * @property y
   * @type Number
   * @default 0
   */
  this.y = y || 0;

  /**
   * @property radius
   * @type Number
   * @default 0
   */
  this.radius = radius || 0;
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class Line
 * @constructor
 * @param x1 {Number} The X1 coordinate of this line
 * @param y1 {Number} The Y1 coordinate of this line
 * @param x2 {Number} The X2 coordinate of this line
 * @param y2 {Number} The Y2 coordinate of this line
 */
NPEngine.Line = function(x1, y1, x2, y2) {
  /**
   * @property x1
   * @type Number
   * @default 0
   */
  this.x1 = x1 || 0;

  /**
   * @property y1
   * @type Number
   * @default 0
   */
  this.y1 = y1 || 0;

  /**
   * @property x2
   * @type Number
   * @default 0
   */
  this.x2 = x2 || 0;

  /**
   * @property y2
   * @type Number
   * @default 0
   */
  this.y2 = y2 || 0;

  /**
   * @property lineLength
   * @type Number
   */
  this.lineLength = Math.sqrt((x2-x1)*(x2-x1)-(y2-y1)*(y2-y1));

  /**
   * @property lineWidth
   * @type Number
   * @default 1
   */
  this.lineWidth = 1;
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class Point
 * @constructor
 * @param x {Number} The X coordinate of this point
 * @param y {Number} The Y coordinate of this point
 */

NPEngine.Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

NPEngine.Point.prototype = {
  constructor: NPEngine.Point
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Pendulum NPObject
 *
 * @class NPEngine.Pendulum
 * @extends NPObject
 * @constructor
 */
NPEngine.Pendulum = function() {
  NPEngine.NPObject.call( this );

  this.type = NPEngine.NPObject.PENDULUM;
  this.interactive = true;

  var pivot = new NPEngine.Point();
  var line = new NPEngine.Line();
  var circle = new NPEngine.Circle();

  this.getPivot = function() {
    return pivot;
  };

  this.setPivot = function(val) {
    if (val.x) {
      pivot.x = val.x || pivot.x;
      line.x1 = pivot.x;
    }
    if (val.y) {
      pivot.y = val.y || pivot.y;
      line.y1 = pivot.y;
    }
  };

  this.getCircle = function() {
    return circle;
  };

  this.setCircle = function(val) {
    if (val.x) {
      circle.x = val.x;
      line.x2 = val.x;
    }
    if (val.y) {
      circle.y = val.y;
      line.y2 = val.y;
    }
    if (val.radius) {
      circle.radius = val.radius;
    }
  };

  this.getLine = function() {
    return line;
  };

  this.update = function() {
//    console.log('update object');
  };

  this.isObjectEvent = function(event) {
    return event.pageX * event.pageX + event.pageY * event.pageY < circle.radius * circle.radius;
  };

  this.onMouseDown = function(event) {
    console.log('onMouseDown');
  };
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.NPObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPEngine.Grid
 * @constructor
 */
NPEngine.Grid = function() {
};











//NPEngine.Grid = function () {
//  NPEngine.DisplayObject.call(this);
//
//  // initial variables
//  this.width = 0;
//  this.height = 0;
//};
//
//NPEngine.Grid.prototype = Object.create(NPEngine.DisplayObject.prototype);
//NPEngine.Grid.prototype.constructor = NPEngine.Grid;
//
//
//
//NPEngine.Grid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
//  this.width = viewWidth;
//  this.height = viewHeight;
//  this.centerWidth = Math.round(viewWidth/2);
//  this.centerHeight = Math.round(viewHeight/2);
//};
//
//NPEngine.Grid.prototype.compute = function () {
//};
//
//NPEngine.Grid.prototype.update = function () {
//};
//
//NPEngine.Grid.prototype.render = function (context) {
//  var stroke = 'rgba(255, 255, 255, 0.7)';
//  var fill = 'rgba(255, 255, 255, 0.8)';
//
//  context.beginPath();
//    context.lineWidth = 0.5;
//    context.strokeStyle = stroke;
//
//    // draw left column line
//    for (var i=this.centerWidth-100; i>0; i-=100) {
//      context.moveTo(i, 0);
//      context.lineTo(i, this.height);
//    }
//
//    // draw right column line
//    for (var i=this.centerWidth+100; i<this.width; i+=100) {
//      context.moveTo(i, 0);
//      context.lineTo(i, this.height);
//    }
//
//    // draw upper row line
//    for (var i=this.centerHeight; i>0; i-=100) {
//      context.moveTo(0, i);
//      context.lineTo(this.width, i);
//    }
//
//    // draw lower row line
//    for (var i=this.centerHeight; i<this.height; i+=100) {
//      context.moveTo(0, i);
//      context.lineTo(this.width, i);
//    }
//    context.stroke();
//  context.closePath();
//
//  // draw center line
//  context.beginPath();
//    context.lineWidth = 2;
//    context.moveTo(this.centerWidth, 0);
//    context.lineTo(this.centerWidth, this.height);
//    context.moveTo(0, this.centerHeight);
//    context.lineTo(this.width, this.centerHeight);
//    context.strokeStyle = stroke;
//    context.stroke();
//  context.closePath();
//};
//
//NPEngine.Grid.prototype.setWidth = function(width) {
//  this.width = width;
//};
//
//NPEngine.Grid.prototype.setHeight = function(height) {
//  this.height = height;
//};
//
//NPEngine.Grid.prototype.convertToGridPoint = function(point) {
//  var convertedX = this.centerWidth + point.x * 100;
//  var convertedY = this.centerHeight + point.y * -100;
//  return new NPEngine.Point(convertedX, convertedY);
//};
//
//NPEngine.Grid.prototype.convertToVectorValueX = function(x) {
//  return this.centerWidth + x * 100;
//};
//
//NPEngine.Grid.prototype.convertToVectorValueY = function(y) {
//  return this.centerHeight + y * -100;
//};
//
//NPEngine.Grid.prototype.convertToGridScalaValue = function(value) {
//  return value*100;
//};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * A set of functions used by the canvas renderer to draw the primitive npobjects
 *
 * @class NPEngine.CanvasGraphics
 * @constructor
 */
NPEngine.CanvasGraphics = function() {
  /**
   * Renders the npobjects
   *
   * @method renderGraphics
   * @param ctx {CanvasRenderingContext2D} the 2d drawing method of the canvas
   * @param rendererManager {NPEngine.RendererManager} color package
   */
  this.renderGraphics = function(ctx, rendererManager) {
    var scale = rendererManager.scale;
    var theme = rendererManager.theme;
    var npobjects = rendererManager.npobjects;
    var zeroPoint = rendererManager.zeroPoint;

    ctx.save();
    ctx.strokeStyle = theme.strokeStyle;
    for (var i= 0, len= npobjects.length; i<len; i++) {
      var obj = npobjects[i];

      if (obj.type == NPEngine.NPObject.PENDULUM) {
        var pivot = obj.getPivot();
        var circle = obj.getCircle();

        ctx.beginPath();
        ctx.lineWidth = obj.getLine().lineWidth;
        ctx.moveTo(zeroPoint.x+pivot.x*scale, zeroPoint.y-pivot.y*scale);
        ctx.lineTo(zeroPoint.x+circle.x*scale, zeroPoint.y-circle.y*scale);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(zeroPoint.x+circle.x*scale, zeroPoint.y-circle.y*scale, circle.radius*scale, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
      } else {
        throw new Error('NPObject type does not match.');
      }
    }
    ctx.restore();
  }
};
/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * the CanvasRenderer draws the view and all its content onto a 2d canvas.
 * This renderer should be used for browsers that do not support webGL.
 *
 * @class NPEngine.CanvasRenderer
 * @param rendererManager {NPEngine.RendererManager}
 * @constructor
 */
NPEngine.CanvasRenderer = function(rendererManager) {
  /**
   * The canvas 2d context that everything is drawn with
   * @property ctx
   * @type CanvasRenderingContext2D
   */
  var ctx = rendererManager.canvas.getContext('2d');

  /**
   * A class of functions used by the canvas renderer to draw the primitive npobject graphics data
   * @property graphics
   * @type NPEngine.CanvasGraphics
   */
  var graphics = new NPEngine.CanvasGraphics(rendererManager.theme, rendererManager.theme);

  /**
   * Render
   * @method render
   */
  this.render = function() {
    this.clear();
    graphics.renderGraphics(ctx, rendererManager);
  };

  /**
   * Clears the canvas
   * @method clear
   */
  this.clear = function() {
    ctx.save();
    ctx.fillStyle = rendererManager.theme.bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    ctx.restore();
  };
};
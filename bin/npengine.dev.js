NPEngine = function() {
  this.renderer = new NPEngine.CanvasRenderer;
  this.renderer.init();

  this.isStop = false;
};

NPEngine.prototype.constructor = NPEngine.Pendulum;



NPEngine.prototype.render = function() {
  if (this.isStop) {
    return ;
  }
  this.renderer.render();
};

NPEngine.prototype.stop = function() {
  this.isStop = true;
};

NPEngine.prototype.start = function() {
  this.renderer.init();
  this.isStop = false;
};

NPEngine.prototype.setDebug = function(flag) {
  this.renderer.setFps(flag);
};

NPEngine.prototype.addDisplayObject = function(displayObject) {
  if (displayObject == null) {
    throw new Error('Parameter can not be null');
  }

  if ((displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error('Parameter is not DisplayObject');
  }

  displayObject.compute();
  this.renderer.addChild(displayObject);
};

NPEngine.prototype.setBackground = function(displayObject) {
  if (displayObject == null) {
    throw new Error('Parameter can not be null');
  }

  if ((displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error('Parameter is not DisplayObject');
  }

  this.renderer.setBackground(displayObject);
};
NPEngine.DBHelper = function () {
};

NPEngine.DBHelper.prototype.constructor = NPEngine.DBHelper;



NPEngine.DBHelper.prototype.createDB = function (callback) {
  var that = this;
  var request = window.indexedDB.deleteDatabase('NPEngine');
  request.onsuccess = function() {
    that.open();
  };
  request.onerror = function() {
    alert('create db error');
  };
};

NPEngine.DBHelper.prototype.promiseOpen = function (displayObject) {
  var version = 1;
  var promise = new Promise(function(resolve, reject) {
    var request = window.indexedDB.open('NPEngine', version);
    request.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(displayObject.toString())) {
        var objectStore = db.createObjectStore(displayObject.toString(), {keyPath: 'time'});
      }
    };
    request.onsuccess = function(e) {
      this.db = e.target.result;
      resolve(this.db);
    };
    request.onerror = function(e) {
      reject(e);
    }
  });
  return promise;
};


















NPEngine.DisplayObject = function() {
};

NPEngine.DisplayObject.prototype.constructor = NPEngine.DisplayObject;



NPEngine.DisplayObject.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.DisplayObject.prototype.compute = function () {
};

NPEngine.DisplayObject.prototype.update = function () {
};

NPEngine.DisplayObject.prototype.render = function (context) {
};

NPEngine.Grid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
};

NPEngine.Grid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Grid.prototype.constructor = NPEngine.Grid;



NPEngine.Grid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = Math.round(viewHeight/2);
};

NPEngine.Grid.prototype.compute = function () {
};

NPEngine.Grid.prototype.update = function () {
};

NPEngine.Grid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = '#550000';

  // draw left column line
  for (var i=this.centerWidth-100; i>0; i-=100) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw right column line
  for (var i=this.centerWidth+100; i<this.width; i+=100) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerHeight; i>0; i-=100) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }

  // draw lower row line
  for (var i=this.centerHeight; i<this.height; i+=100) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }
  context.stroke();

  // draw center line
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = '#550000';
  context.moveTo(this.centerWidth, 0);
  context.lineTo(this.centerWidth, this.height);
  context.moveTo(0, this.centerHeight);
  context.lineTo(this.width, this.centerHeight);
  context.stroke();
};

NPEngine.Grid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.Grid.prototype.setHeight = function(height) {
  this.width = width;
}

NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.ball1 = new NPEngine.Point;
  this.ball2 = new NPEngine.Point;
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.ball1.x = -0.1;
  this.ball1.y = 0.1;
  this.ball2.x = 0.1;
  this.ball2.y = 0;
};

NPEngine.Collision2d.prototype.update = function () {
};

NPEngine.Collision2d.prototype.render = function (context) {
  context.beginPath();
  context.arc(this.ball1.x, this.ball1.y, 10, 0, 2*Math.PI, true);
  context.arc(this.ball2.x, this.ball2.y, 10, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Collision2d.prototype.compute = function () {
};

NPEngine.Pendulum = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.mass = 10;
  this.length = 5;
  this.gravity = 9.8;
  this.theta0 = 0.785398;
  this.deltaTime = 0.01;

  // initial position
  this.pivot = new NPEngine.Point(400, 0);
  this.circle = new NPEngine.Point;

  this.init();
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.init = function() {
  this.period = Math.round((2 * Math.PI * Math.sqrt(this.length/this.gravity))*(1/this.deltaTime));
  this.circumference = this.length * this.theta0;
  this.startTime = new Date().getTime();
}

NPEngine.Pendulum.prototype.toString = function() {
  return 'Pendulum';
};

NPEngine.Pendulum.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime*1000)); // millisecond to 0.01 second
  var phase = Math.round(gap%this.period);

  this.circle.x = this.memory[phase].x;
  this.circle.y = this.memory[phase].y;
};

NPEngine.Pendulum.prototype.render = function (context) {
  var convertedLength = Math.round(this.length/50)+40;
  var convertedMass = Math.round(this.mass/3)+22;
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function (x, y) {
  this.pivot.x = x;
  this.pivot.y = y;
};

/**
 * Set pendulum's ball by relative pivot's coordinates
 *
 * @method setCircle
 * @param x {Number} The X coord of the point to circle from pivot
 * @param y {Number} The Y coord of the point to circle from pivot
 */
NPEngine.Pendulum.prototype.setCircleCoordsFromPivot = function (x, y) {
  this.circle.x = this.pivot.x + x;
  this.circle.y = this.pivot.y + y;
};

NPEngine.Pendulum.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.Pendulum.prototype.setLength = function (value) {
  this.length = value;
};

NPEngine.Pendulum.prototype.setTheta0 = function (degree) {
  this.theta0 = NPEngine.Convert.toRadians(degree);
};

NPEngine.Pendulum.prototype.setDeltaT = function (value) {
  this.deltaTime = value;
};

NPEngine.Pendulum.prototype.compute = function () {
  this.init();

  this.memory = [];
  var period = this.period;
  var velocity = 0;
  var circumference = this.circumference;

  for (var i=0; i<period; i++) {
    velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
    circumference = circumference+velocity*this.deltaTime;
    var thetaValue = circumference/this.length;
    var xValue = this.length*Math.sin(thetaValue).toFixed(6);
    var yValue = this.length*Math.cos(thetaValue).toFixed(6);
    this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});
  }
};

NPEngine.Spring = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.pivot = new NPEngine.Point(0, 300);
  this.block = new NPEngine.Point(300, 300);
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.pivot.x = 0;
  this.pivot.y = parseInt(viewHeight/2);
  this.block.x = parseInt(viewWidth/2);
  this.block.y = parseInt(viewHeight/2);
};

NPEngine.Spring.prototype.update = function () {
};

NPEngine.Spring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.block.x, this.block.y);
  context.stroke();

//  context.beginPath();
//  context.arc(this.pivot.x + this.circle.x * convertedLength, this.pivot.y + this.circle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
//  context.fillStyle = 'black';
//  context.fill();
//  context.stroke();
};

NPEngine.Spring.prototype.compute = function () {
};

NPEngine.CanvasRenderer = function () {
  this.DEBUG = true;

  this.background = null;
  this.children = [];

  this.view = document.createElement("canvas");
  this.view.width = 800;
  this.view.height = 600;
  document.body.appendChild(this.view);

  this.context = this.view.getContext("2d");

  if (this.DEBUG) {
    this.fps = new NPEngine.FPSBoard();
  }

  this.time = new NPEngine.TimeBoard;
};

// constructor
NPEngine.CanvasRenderer.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.CanvasRenderer.prototype.init = function() {
  this.time.init();
}

NPEngine.CanvasRenderer.prototype.render = function () {
  // clear
  this.context.clearRect(0, 0, this.view.width, this.view.height);

  // update
  var length = this.children.length;
  for (var i = 0; i < length; i++) {
    this.children[i].update();
  }

  if (this.DEBUG) {
    this.fps.update();
  }
  this.time.update();

  // render
  if (this.background != null) {
    this.background.render(this.context);
  }
  for (var i = 0; i < length; i++) {
    this.children[i].render(this.context);
  }

  if (this.DEBUG) {
    this.fps.render(this.context);
  }
  this.time.render(this.context);
};

NPEngine.CanvasRenderer.prototype.addChild = function (displayObject) {
  if ((displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error();
  }
  displayObject.onAttachedRenderer(this.view.width, this.view.height);
  this.children.push(displayObject);
};

NPEngine.CanvasRenderer.prototype.setFps = function (visible) {
  if (visible == true) {
    this.fps.visible = true;
  }
  else if (visible == false) {
    this.fps.visible = false;
  }
};

NPEngine.CanvasRenderer.prototype.setBackground = function (displayObject) {
  displayObject.onAttachedRenderer(this.view.width, this.view.height);
  this.background = displayObject;
};
NPEngine.FPSBoard = function() {
    this.visible = true;
    this.then = new Date;
    this.count = 0;
    this.fps = 0;
};

// constructor
NPEngine.FPSBoard.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.FPSBoard.prototype.update = function() {
    this.count++;
};

NPEngine.FPSBoard.prototype.render = function(context) {
    var now = new Date;
    var delta = now - this.then;

    if (this.count%80 == 0) {
        this.fps = Number((1000/delta).toFixed(1));
    }

    if (this.visible == true) {
        context.font="20px Arial";
        context.fillText("fps: " + this.fps, 0, 46);
    }
    this.then = now;
};
NPEngine.TimeBoard = function () {
  this.visible = true;
  this.init();
};

// constructor
NPEngine.TimeBoard.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.TimeBoard.prototype.init = function () {
  this.then = new Date().getTime();
}

NPEngine.TimeBoard.prototype.update = function () {
};

NPEngine.TimeBoard.prototype.render = function (context) {
  if (this.visible == false) {
    return ;
  }

  var now = new Date().getTime();
  var delta = now - this.then;
  var timeFormat = NPEngine.Convert.toTimeFormat(delta);

  if (this.visible == true) {
    context.font = "20px Arial";
    context.fillText("Time: " + timeFormat, 0, 22);
  }
};
NPEngine.Convert = function() {};

NPEngine.Convert.prototype = Object.create(NPEngine.Convert.prototype);
NPEngine.Convert.prototype.constructor = NPEngine.Convert;



NPEngine.Convert.toDegrees = function(angle) {
  return angle * (180/Math.PI);
}

NPEngine.Convert.toRadians = function(angle) {
  return angle * (Math.PI/180);
}

NPEngine.Convert.toTimeFormat = function(milliseconds) {
  milliseconds = parseInt(milliseconds/10);

  var ms = milliseconds % 100;
  milliseconds = (milliseconds - ms) / 100;
  var secs = milliseconds % 60;
  milliseconds = (milliseconds - secs) / 60;


  var mins = milliseconds % 60;
  if (mins < 10) {
    mins = '0' + mins;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }
  if (ms < 10) {
    ms = '0' + ms;
  }
//  var hrs = (milliseconds - mins) / 60;

//  return hrs + ':' + mins + ':' + secs + '.' + ms;
  return mins + ':' + secs + ':' + ms;
}
NPEngine.Point = function(positionX, positionY) {
    this.x = positionX || 0;
    this.y = positionY || 0;
};

NPEngine.Point.prototype = Object.create(NPEngine.Point.prototype);
NPEngine.Point.prototype.constructor = NPEngine.Point;

NPEngine.Point.prototype.setX = function(positionX) {
    this.x = positionX || this.x;
}

NPEngine.Point.prototype.setY = function(positionY) {
    this.y = positionY || this.y;
}

NPEngine.Point.prototype.getX = function() {
    return this.x;
}

NPEngine.Point.prototype.getY = function() {
    return this.y;
}
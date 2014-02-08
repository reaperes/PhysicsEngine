NPEngine = function() {
  this.renderer = new NPEngine.CanvasRenderer;
};

NPEngine.prototype.constructor = NPEngine.Pendulum;



NPEngine.prototype.render = function() {
  this.renderer.render();
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

// constructor
NPEngine.DisplayObject.prototype.constructor = NPEngine.DisplayObject;

NPEngine.Pendulum = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.mass = 1;
  this.length = 10;
  this.gravity = 9.8;
  this.theta0 = 0.785398;
  this.circumference = this.length * this.theta0;
  this.deltaTime = 0.01;

  // initial position
  this.pivot = new NPEngine.Point(400, 0);
  this.circle = new NPEngine.Point;

  // etc variables
  this.period = Math.round((2 * Math.PI * Math.sqrt(this.length/this.gravity))*100);

  // update variables
  this.isStart = false;
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.toString = function() {
  return 'Pendulum';
};

NPEngine.Pendulum.prototype.update = function () {
  if (this.isStart == false) {
    this.startTime = new Date().getTime();
    this.isStart = true;
  }
  var gap = Math.round((new Date().getTime()-this.startTime)/10); // millisecond to 0.01 second
  var phase = Math.round(gap%this.period);

  this.circle.x = this.memory[phase].x;
  this.circle.y = this.memory[phase].y;
};

NPEngine.Pendulum.prototype.render = function (context) {
  var ratio = 10;
  context.beginPath();
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.circle.x * ratio, this.pivot.y + this.circle.y * ratio);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.circle.x * ratio, this.pivot.y + this.circle.y * ratio, 10, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function (x, y) {
  if (x == 'undefined' || y == 'undefined')
    throw new Error(x + 'or ' + y + ' is undefined');

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
  if (x == 'undefined' || y == 'undefined')
    throw new Error(x + 'or ' + y + ' is undefined');

  this.circle.x = this.pivot.x + x;
  this.circle.y = this.pivot.y + y;
};

NPEngine.Pendulum.prototype.setMass = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }

  this.circleMass = value;
  this.calculateRadius();
};

NPEngine.Pendulum.prototype.setLineLength = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.lineLength = value;
};

NPEngine.Pendulum.prototype.setTheta0 = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.circleTheta0 = value;
  this.circlePosition0 = this.lineLength * this.circleTheta0;
  this.circumference = this.circlePosition0;
};

NPEngine.Pendulum.prototype.setT = function (value) {
  if (value == 'undefined') {
    throw new Error(value + ' is undefined');
  }
  this.t = value;
};

NPEngine.Pendulum.prototype.compute = function () {
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

NPEngine.CanvasRenderer = function () {
  this.DEBUG = true;

  this.children = [];

  this.view = document.createElement("canvas");
  this.view.width = 800;
  this.view.height = 600;
  document.body.appendChild(this.view);

  this.context = this.view.getContext("2d");

  if (this.DEBUG) {
    this.fps = new NPEngine.FPSBoard();
  }
};

// constructor
NPEngine.CanvasRenderer.prototype.constructor = NPEngine.CanvasRenderer;


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

  // render
  for (var i = 0; i < length; i++) {
    this.children[i].render(this.context);
  }

  if (this.DEBUG) {
    this.fps.render(this.context);
  }
};

NPEngine.CanvasRenderer.prototype.addChild = function (displayObject) {
  if (displayObject instanceof NPEngine.DisplayObject) {
    this.children.push(displayObject);
  }
};

NPEngine.CanvasRenderer.prototype.setFps = function (visible) {
  if (visible == true) {
    this.fps.visible = true;
  }
  else if (visible == false) {
    this.fps.visible = false;
  }
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

    if (this.count%100 == 0) {
        this.fps = Number((1000/delta).toFixed(1));
    }

    if (this.visible == true) {
        context.font="20px Arial";
        context.fillText("fps: " + this.fps, 0, 22);
    }
    this.then = now;
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
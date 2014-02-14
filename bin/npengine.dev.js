NPEngine = function() {
  this.renderer = new NPEngine.CanvasRenderer;
};

NPEngine.prototype.constructor = NPEngine.Pendulum;



NPEngine.prototype.start = function() {
  var that = this;
  this.isStart = true;

  this.renderer.onEnginePreStart();
  this.renderer.onEngineStart();
  requestAnimationFrame(run);
  function run() {
    if (!that.isStart) {
      return ;
    }
    requestAnimationFrame(run);
    that.renderer.render();
  }
};

NPEngine.prototype.stop = function() {
  this.isStart = false;

  this.renderer.onEngineStop();
};

NPEngine.prototype.setFps = function(flag) {
  this.renderer.setFps(flag);
};

NPEngine.prototype.addDisplayObject = function(displayObject) {
  if (displayObject == null) {
    throw new Error('Parameter can not be null');
  }

  if ((displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error('Parameter is not DisplayObject');
  }

  this.renderer.addChild(displayObject);
};

NPEngine.prototype.setGrid = function(gridObject) {
  if (gridObject == null) {
    throw new Error('Parameter can not be null');
  }

  if ((gridObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error('Parameter is not DisplayObject');
  }

  this.renderer.setGrid(gridObject);
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
};

NPEngine.Point.prototype.setY = function(positionY) {
    this.y = positionY || this.y;
};

NPEngine.Point.prototype.getX = function() {
    return this.x;
};

NPEngine.Point.prototype.getY = function() {
    return this.y;
};

NPEngine.Point.prototype.distance = function(target) {
  return Math.sqrt(Math.pow((this.x-target.x),2)+Math.pow((this.y-target.y),2));
};

NPEngine.Point.prototype.clone = function() {
  return new NPEngine.Point(this.x, this.y);
}
NPEngine.Rectangle = function(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.center = new NPEngine.Point;
};

NPEngine.Rectangle.prototype.constructor = NPEngine.Rectangle;


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

NPEngine.DisplayObject.prototype.onAttachedGrid = function (gridObject) {
};

NPEngine.DisplayObject.prototype.onStart = function() {
};

NPEngine.DisplayObject.prototype.onStop = function() {
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
};

NPEngine.Grid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * 100;
  var convertedY = this.centerHeight + point.y * -100;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.Grid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * 100;
};

NPEngine.Grid.prototype.convertToVectorValueY = function(y) {
  return this.centerWidth + y * -100;
};

NPEngine.Grid.prototype.convertToGridScalaValue = function(value) {
  return value*100;
};

NPEngine.Collision2d = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.deltaTime = 0.001;  //second
  this.ball1 = new NPEngine.Point(-1, 1);
  this.ball2 = new NPEngine.Point(1, 0);
  this.curBall1 = new NPEngine.Point;
  this.curBall2 = new NPEngine.Point;
  this.mass1 = 2;         // kg
  this.mass2 = 2;
  this.diameter1 = 1;   // m
  this.diameter2 = 1;
  this.velocity1_x = 3;    // m/s
  this.velocity1_y = 1.5;
  this.velocity2_x = 0;
  this.velocity2_y = 0;
  this.k = 10000;         // N/m
  this.mu = 50;           // N s/m
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.Collision2d.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Collision2d.prototype.onStart = function() {
  this.startTime = new Date().getTime();
};

NPEngine.Collision2d.prototype.onStop = function() {
};

NPEngine.Collision2d.prototype.compute = function () {
  this.memory = [];
  var ball1_x = this.ball1.x;
  var ball1_y = this.ball1.y;
  var ball2_x = this.ball2.x;
  var ball2_y = this.ball2.y;
  var sumOfDiameter = this.diameter1 + this.diameter2;
  this.memory.push({time: 0, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});

  var velocity1_x = this.velocity1_x;
  var velocity1_y = this.velocity1_y;
  var velocity2_x = this.velocity2_x;
  var velocity2_y = this.velocity2_y;
  var forceX1;
  var forceY1;

  for (var i=1; i<10000; i++) {
    var distanceOfBall = Math.sqrt(Math.pow((ball1_x-ball2_x),2)+Math.pow((ball1_y-ball2_y),2));
    if (distanceOfBall <= sumOfDiameter) {
      forceX1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_x-ball2_x)/distanceOfBall-this.mu*(velocity1_x-velocity2_x);
      forceY1 = this.k*(sumOfDiameter-distanceOfBall)*(ball1_y-ball2_y)/distanceOfBall-this.mu*(velocity1_y-velocity2_y);
      velocity1_x = velocity1_x + forceX1/this.mass1*this.deltaTime;
      velocity1_y = velocity1_y + forceY1/this.mass1*this.deltaTime;
      velocity2_x = velocity2_x - forceX1/this.mass2*this.deltaTime;
      velocity2_y = velocity2_y - forceY1/this.mass2*this.deltaTime;
    }

    ball1_x = ball1_x+velocity1_x*this.deltaTime;
    ball1_y = ball1_y+velocity1_y*this.deltaTime;
    ball2_x = ball2_x+velocity2_x*this.deltaTime;
    ball2_y = ball2_y+velocity2_y*this.deltaTime;
    this.memory.push({time: i, ball1_x: ball1_x, ball1_y: ball1_y, ball2_x: ball2_x, ball2_y: ball2_y});
  }
};

NPEngine.Collision2d.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/1); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    this.curBall1.x = data.ball1_x;
    this.curBall1.y = data.ball1_y;
    this.curBall2.x = data.ball2_x;
    this.curBall2.y = data.ball2_y;
  }
};

NPEngine.Collision2d.prototype.render = function (context) {
  var convertedBall1 = this.grid.convertToGridPoint(this.curBall1);
  var convertedBall2 = this.grid.convertToGridPoint(this.curBall2);
  var convertedDiameter1 = this.grid.convertToGridScalaValue(this.diameter1);
  var convertedDiameter2 = this.grid.convertToGridScalaValue(this.diameter2);

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(convertedBall1.x, convertedBall1.y, convertedDiameter1, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(convertedBall2.x, convertedBall2.y, convertedDiameter2, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
};

NPEngine.Collision2d.prototype.setMass1 = function(value) {
  this.mass1 = value;
};

NPEngine.Collision2d.prototype.setMass2 = function(value) {
  this.mass2 = value;
};

NPEngine.Collision2d.prototype.setK = function(value) {
  this.k = value;
};

NPEngine.Collision2d.prototype.setMu = function(value) {
  this.mu = value;
};

NPEngine.Collision2d.prototype.setDiameter1 = function(value) {
  this.diameter1 = value;
};

NPEngine.Collision2d.prototype.setDiameter2 = function(value) {
  this.diameter2 = value;
};

NPEngine.Collision2d.prototype.setBall1_x = function(value) {
  this.ball1.x = value;
};

NPEngine.Collision2d.prototype.setBall1_y = function(value) {
  this.ball1.y = value;
};

NPEngine.Collision2d.prototype.setBall2_x = function(value) {
  this.ball2.x = value;
};

NPEngine.Collision2d.prototype.setBall2_y = function(value) {
  this.ball2.y = value;
};

NPEngine.Collision2d.prototype.setVelocity1_x = function(value) {
  this.velocity1_x = value;
};

NPEngine.Collision2d.prototype.setVelocity1_y = function(value) {
  this.velocity1_y = value;
};

NPEngine.Collision2d.prototype.setVelocity2_x = function(value) {
  this.velocity2_x = value;
};

NPEngine.Collision2d.prototype.setVelocity2_y = function(value) {
  this.velocity2_y = value;
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
  this.pivot = new NPEngine.Point;
  this.curCircle = new NPEngine.Point;
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.pivot.x = Math.round(viewWidth/2);
  this.pivot.y = 0;
};

NPEngine.Pendulum.prototype.onStart = function() {
  this.startTime = new Date().getTime();
};

NPEngine.Pendulum.prototype.onStop = function() {
};

NPEngine.Pendulum.prototype.compute = function () {
  this.memory = [];
  this.period = Math.round((2 * Math.PI * Math.sqrt(this.length/this.gravity))*(1/this.deltaTime));
  var velocity = 0;
  var circumference = this.length * this.theta0;

  for (var i=0; i<this.period; i++) {
    velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
    circumference = circumference+velocity*this.deltaTime;
    var thetaValue = circumference/this.length;
    var xValue = this.length*Math.sin(thetaValue).toFixed(6);
    var yValue = this.length*Math.cos(thetaValue).toFixed(6);
    this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});
  }
};

NPEngine.Pendulum.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime*1000)); // millisecond to 0.01 second
  var phase = Math.round(gap%this.period);

  this.curCircle.x = this.memory[phase].x;
  this.curCircle.y = this.memory[phase].y;
};

NPEngine.Pendulum.prototype.render = function (context) {
  var convertedLength = Math.round(this.length/50)+40;
  var convertedMass = Math.round(this.mass/3)+22;
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot.x, this.pivot.y);
  context.lineTo(this.pivot.x + this.curCircle.x * convertedLength, this.pivot.y + this.curCircle.y * convertedLength);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot.x + this.curCircle.x * convertedLength, this.pivot.y + this.curCircle.y * convertedLength, convertedMass, 0, 2 * Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function (x, y) {
  this.pivot.x = x;
  this.pivot.y = y;
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
NPEngine.Spring = function () {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle();
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // initial variables
  this.mass = 2;      // kg
  this.k = 100;       // N/m
  this.gravity = 9.8; // m/s^2
  this.mu = 3;        // N s/m
  this.block.center.x = 4;    // m
  this.block.center.y = 0;    // m/s
  this.velocity = 0;  // m/s
  this.deltaTime = 0.01;
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.Spring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Spring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.startTime = new Date().getTime();
};

NPEngine.Spring.prototype.onStop = function() {
};

NPEngine.Spring.prototype.compute = function () {
  this.memory = [];
  var blockPosX = this.block.center.x;
  var velocity = this.velocity;
  var force = -this.k*blockPosX-this.mu*velocity;
  this.memory.push({time: 0, blockPosX: blockPosX});

  for (var i=1; i<10000; i++) {
    velocity = velocity+force/this.mass*this.deltaTime;
    blockPosX = blockPosX+velocity*this.deltaTime;
    force = -this.k*blockPosX-this.mu*velocity;
    this.memory.push({time: i, blockPosX: blockPosX});
  }
};

NPEngine.Spring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.startTime)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.Spring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 4;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();

  context.beginPath();
  context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.CanvasRenderer = function () {
  this.DEBUG = false;

  this.grid = null;
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
  if (this.grid != null) {
    this.grid.render(this.context);
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

  if (this.grid != null) {
    displayObject.onAttachedGrid(this.grid);
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

NPEngine.CanvasRenderer.prototype.setGrid = function (gridObject) {
  gridObject.onAttachedRenderer(this.view.width, this.view.height);
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onAttachedGrid(gridObject);
  }
  this.grid = gridObject;
};

NPEngine.CanvasRenderer.prototype.onEnginePreStart = function() {
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].compute();
  }
};

NPEngine.CanvasRenderer.prototype.onEngineStart = function() {
  this.time.init();
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onStart();
  }
};

NPEngine.CanvasRenderer.prototype.onEngineStop = function() {
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onStop();
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
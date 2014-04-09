/**
 @param {HTMLElement} canvas
 @return {NPEngine}
 */
NPEngine = function(canvas) {
  //this.fps = new NPEngine.FPS();
  this.state = 'create';    // create, init, ready, start, resume, pause, stop, destroy

  if (!canvas) {
    var c = document.createElement("canvas");
    c.width = 800;
    c.height = 600;
    document.body.appendChild(c);
    canvas = c;
  }

  var that = this;
  this.keyHandler = function(e) {
    if (e.keyCode != 13) {
      return ;
    }
    if (that.state == 'create' || that.state == 'init' || that.state == 'destroy') {
      return ;
    }

    if (that.state=='ready') {
      that.start();
    }
    else if (that.state=='resume') {
      that.pause();
    }
    else if (that.state=='pause') {
      that.resume();
    }
  };
  window.addEventListener("keypress", this.keyHandler, false);

  var clickHandler = function(e) {
    if (that.state == 'create' || that.state == 'init' || that.state == 'destroy') {
      return ;
    }

    if (that.state=='ready') {
      that.start();
    }
    else if (that.state=='resume') {
      that.pause();
    }
    else if (that.state=='pause') {
      that.resume();
    }
  };
  canvas.addEventListener('click', clickHandler, false);

  this.init(canvas);
};

NPEngine.prototype.constructor = NPEngine;



NPEngine.prototype.init = function(canvas) {
  this.renderer = new NPEngine.CanvasRenderer(canvas);
  this.state = 'init';
};

NPEngine.prototype.ready = function() {
  this.renderer.compute();
  this.renderer.onEngineReady();
  this.state = 'ready';
};

NPEngine.prototype.start = function() {
  this.renderer.onEngineStart();
  this.state = 'start';

  this.resume();
};

NPEngine.prototype.resume = function() {
  var that = this;
  this.isRun = true;

  this.renderer.onEngineResume();
  this.state = 'resume';

  requestAnimationFrame(run);
  function run() {
    if (!that.isRun) {
      return ;
    }
    requestAnimationFrame(run);
    that.renderer.update();
    //that.fps.begin();
    that.renderer.render();
    //that.fps.end();
  }
};

NPEngine.prototype.pause = function() {
  this.state = 'pause';
  this.isRun = false;
  this.renderer.onEnginePause();
};

NPEngine.prototype.stop = function() {
  this.state = 'stop';
  this.isRun = false;
  this.renderer.onEngineStop();
};

NPEngine.prototype.destroy = function() {
  this.state = 'destroy';
  this.renderer.onEngineDestroy();
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

/**
 * @author mrdoob / http://mrdoob.com/
 */
NPEngine.FPS = function() {
  var startTime = Date.now(), prevTime = startTime;
  var ms = 0, msMin = Infinity, msMax = 0;
  var fps = 0, fpsMin = Infinity, fpsMax = 0;
  var frames = 0, mode = 0;

  var container = document.createElement( 'div' );
  container.id = 'stats';
  container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
  container.style.cssText='width:80px;opacity:0.6;position:absolute;left:0px;top:0px';
  document.body.appendChild(container);

  var fpsDiv = document.createElement( 'div' );
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild( fpsDiv );

  var fpsText = document.createElement( 'div' );
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild( fpsText );

  var fpsGraph = document.createElement( 'div' );
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild( fpsGraph );

  while ( fpsGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild( bar );

  }

  var msDiv = document.createElement( 'div' );
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild( msDiv );

  var msText = document.createElement( 'div' );
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild( msText );

  var msGraph = document.createElement( 'div' );
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild( msGraph );

  while ( msGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild( bar );

  }

  var setMode = function ( value ) {

    mode = value;

    switch ( mode ) {

      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;
      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }

  }

  var updateGraph = function ( dom, value ) {

    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';

  }

  return {

    REVISION: 11,

    domElement: container,

    setMode: setMode,

    begin: function () {

      startTime = Date.now();

    },

    end: function () {

      var time = Date.now();

      ms = time - startTime;
      msMin = Math.min( msMin, ms );
      msMax = Math.max( msMax, ms );

      msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
      updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

      frames ++;

      if ( time > prevTime + 1000 ) {

        fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
        fpsMin = Math.min( fpsMin, fps );
        fpsMax = Math.max( fpsMax, fps );

        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

        prevTime = time;
        frames = 0;

      }

      return time;

    },

    update: function () {

      startTime = this.end();

    }

  }

};


// constructor
NPEngine.FPS.prototype.constructor = NPEngine.FPS;




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



NPEngine.DisplayObject.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
};

NPEngine.DisplayObject.prototype.onAttachedGrid = function (gridObject) {
};

NPEngine.DisplayObject.prototype.compute = function () {
};

NPEngine.DisplayObject.prototype.onReady = function() {
};

NPEngine.DisplayObject.prototype.onStart = function() {
};

NPEngine.DisplayObject.prototype.onResume = function() {
};

NPEngine.DisplayObject.prototype.onPause = function() {
};

NPEngine.DisplayObject.prototype.onStop = function() {
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
  this.height = height;
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
  return this.centerHeight + y * -100;
};

NPEngine.Grid.prototype.convertToGridScalaValue = function(value) {
  return value*100;
};

NPEngine.KeplerGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
  this.ratio = 200;
};

NPEngine.KeplerGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.KeplerGrid.prototype.constructor = NPEngine.Grid;



NPEngine.KeplerGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = Math.round(viewHeight/2);
};

NPEngine.KeplerGrid.prototype.compute = function () {
};

NPEngine.KeplerGrid.prototype.update = function () {
};

NPEngine.KeplerGrid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = '#550000';

  // draw left column line
  for (var i=this.centerWidth-this.ratio; i>0; i-=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw right column line
  for (var i=this.centerWidth+this.ratio; i<this.width; i+=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerHeight; i>0; i-=this.ratio) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }

  // draw lower row line
  for (var i=this.centerHeight; i<this.height; i+=this.ratio) {
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

NPEngine.KeplerGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.KeplerGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.KeplerGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * this.ratio;
  var convertedY = this.centerHeight + point.y * -this.ratio;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.KeplerGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * this.ratio;
};

NPEngine.KeplerGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -this.ratio;
};

NPEngine.KeplerGrid.prototype.convertToGridScalaValue = function(value) {
  return value*this.ratio;
};

NPEngine.QuadrantGrid = function() {
  NPEngine.DisplayObject.call(this);
  this.ratio = 50;
};

NPEngine.QuadrantGrid.prototype.constructor = NPEngine.QuadrantGrid;
NPEngine.QuadrantGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.QuadrantGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;

  // 80 is default default interval
  this.centerX = 80;
  this.centerY = viewHeight-80;
};

NPEngine.QuadrantGrid.prototype.onAttachedGrid = function (gridObject) {
};

NPEngine.QuadrantGrid.prototype.compute = function () {
};

NPEngine.QuadrantGrid.prototype.onReady = function() {
};

NPEngine.QuadrantGrid.prototype.onStart = function() {
};

NPEngine.QuadrantGrid.prototype.onResume = function() {
};

NPEngine.QuadrantGrid.prototype.onPause = function() {
};

NPEngine.QuadrantGrid.prototype.onStop = function() {
};

NPEngine.QuadrantGrid.prototype.update = function () {
};

NPEngine.QuadrantGrid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.4;
  context.strokeStyle = '#550000';

  // draw right column line
  for (var i=this.centerX+80; i<this.width; i+=80) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerY; i>0; i-=80) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }
  context.stroke();

  // draw center line
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = '#550000';
  context.moveTo(this.centerX, 0);
  context.lineTo(this.centerX, this.height);
  context.moveTo(0, this.centerY);
  context.lineTo(this.width, this.centerY);
  context.stroke();
};

NPEngine.QuadrantGrid.prototype.setRatio = function(value) {
  this.ratio = value;
};

NPEngine.QuadrantGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerX+point.x/this.ratio*80;
  var convertedY = this.centerY+point.y/this.ratio*-80;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.QuadrantGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerX + x/this.ratio * 80;
};

NPEngine.QuadrantGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerY + y/this.ratio * -80;
};

NPEngine.QuadrantGrid.prototype.convertToGridScalaValue = function(value) {
  return value/this.ratio*80;
};

NPEngine.RotationGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;
};

NPEngine.RotationGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.RotationGrid.prototype.constructor = NPEngine.RotationGrid;



NPEngine.RotationGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/2);
  this.centerHeight = viewHeight-80;
};

NPEngine.RotationGrid.prototype.compute = function () {
};

NPEngine.RotationGrid.prototype.update = function () {
};

NPEngine.RotationGrid.prototype.render = function (context) {
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

NPEngine.RotationGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.RotationGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.RotationGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * 100;
  var convertedY = this.centerHeight + point.y * -100;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.RotationGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * 100;
};

NPEngine.RotationGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -100;
};

NPEngine.RotationGrid.prototype.convertToGridScalaValue = function(value) {
  return value*100;
};

NPEngine.RotationPlusGrid = function () {
  NPEngine.DisplayObject.call(this);

  // initial variables
  this.width = 0;
  this.height = 0;

  this.ratio = 60;
};

NPEngine.RotationPlusGrid.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.RotationPlusGrid.prototype.constructor = NPEngine.RotationPlusGrid;



NPEngine.RotationPlusGrid.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.centerWidth = Math.round(viewWidth/4);
  this.centerHeight = viewHeight-80;
};

NPEngine.RotationPlusGrid.prototype.compute = function () {
};

NPEngine.RotationPlusGrid.prototype.update = function () {
};

NPEngine.RotationPlusGrid.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = '#550000';

  // draw left column line
  for (var i=this.centerWidth-this.ratio; i>0; i-=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw right column line
  for (var i=this.centerWidth+this.ratio; i<this.width; i+=this.ratio) {
    context.moveTo(i, 0);
    context.lineTo(i, this.height);
  }

  // draw upper row line
  for (var i=this.centerHeight; i>0; i-=this.ratio) {
    context.moveTo(0, i);
    context.lineTo(this.width, i);
  }

  // draw lower row line
  for (var i=this.centerHeight; i<this.height; i+=this.ratio) {
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

NPEngine.RotationPlusGrid.prototype.setWidth = function(width) {
  this.width = width;
};

NPEngine.RotationPlusGrid.prototype.setHeight = function(height) {
  this.height = height;
};

NPEngine.RotationPlusGrid.prototype.convertToGridPoint = function(point) {
  var convertedX = this.centerWidth + point.x * this.ratio;
  var convertedY = this.centerHeight + point.y * -this.ratio;
  return new NPEngine.Point(convertedX, convertedY);
};

NPEngine.RotationPlusGrid.prototype.convertToVectorValueX = function(x) {
  return this.centerWidth + x * this.ratio;
};

NPEngine.RotationPlusGrid.prototype.convertToVectorValueY = function(y) {
  return this.centerHeight + y * -this.ratio;
};

NPEngine.RotationPlusGrid.prototype.convertToGridScalaValue = function(value) {
  return value*this.ratio;
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
  this.velocity1_x = 1;    // m/s
  this.velocity1_y = 0;
  this.velocity2_x = 0;
  this.velocity2_y = 0;
  this.k = 10000;         // N/m
  this.mu = 50;           // N s/m
};

NPEngine.Collision2d.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Collision2d.prototype.constructor = NPEngine.Collision2d;



NPEngine.Collision2d.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.Collision2d.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
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

NPEngine.Collision2d.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall1.x = this.grid.convertToVectorValueX(data.ball1_x);
  this.curBall1.y = this.grid.convertToVectorValueY(data.ball1_y);
  this.curBall2.x = this.grid.convertToVectorValueX(data.ball2_x);
  this.curBall2.y = this.grid.convertToVectorValueY(data.ball2_y);
  this.curBallDiameter1 = this.grid.convertToGridScalaValue(this.diameter1);
  this.curBallDiameter2 = this.grid.convertToGridScalaValue(this.diameter2);
};

NPEngine.Collision2d.prototype.onStart = function() {
};

NPEngine.Collision2d.prototype.onResume = function() {
};

NPEngine.Collision2d.prototype.onPause = function() {
};

NPEngine.Collision2d.prototype.onStop = function() {
};

NPEngine.Collision2d.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/1); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    var ball1_x = this.grid.convertToVectorValueX(data.ball1_x);
    var ball1_y = this.grid.convertToVectorValueY(data.ball1_y);
    var ball2_x = this.grid.convertToVectorValueX(data.ball2_x);
    var ball2_y = this.grid.convertToVectorValueY(data.ball2_y);

    // boundary check
    if (ball1_x < 0 || ball1_x > this.viewWidth || ball1_y < 0 || ball1_y > this.viewheight || ball2_x < 0 || ball2_x > this.viewWidth || ball2_y < 0 || ball2_y > this.viewHeight) {
      return ;
    }
    this.curBall1.x = ball1_x;
    this.curBall1.y = ball1_y;
    this.curBall2.x = ball2_x;
    this.curBall2.y = ball2_y;
  }
};

NPEngine.Collision2d.prototype.render = function (context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall1.x, this.curBall1.y, this.curBallDiameter1, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall2.x, this.curBall2.y, this.curBallDiameter2, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.beginPath();
  context.font = '34pt Calibri';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('1', this.curBall1.x, this.curBall1.y);
  context.fillText('2', this.curBall2.x, this.curBall2.y);
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
NPEngine.ForcedSpring = function () {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.pivot = new NPEngine.Point(-4, 0);
  this.block = new NPEngine.Rectangle();
  this.block.width = 1;     // m
  this.block.height = 0.4;  // m

  // initial variables
  this.mass = 2;      // kg *
  this.k = 100;       // N/m *

  this.f0 = 20        // n *
  this.angularVelocity0 = Math.sqrt(this.k/this.mass);
  this.ww0  = 0.5;    // w / w0 *
  this.angularVelocity = this.angularVelocity0*this.ww0;
  this.phase = 3.141592;  // radian *

  this.gravity = 9.8; // m/s^2
  this.mu = 0;        // N s/m *

  this.block.center.x = 0.1;    // m *
  this.block.center.y = 0;    // m/s

  this.velocity = 0;  // m/s
  this.deltaTime = 0.01;
};

NPEngine.ForcedSpring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.ForcedSpring.prototype.constructor = NPEngine.ForcedSpring;



NPEngine.ForcedSpring.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
};

NPEngine.ForcedSpring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.ForcedSpring.prototype.compute = function () {
  this.memory = [];
  var time = 0;
  var blockPosX = this.block.center.x;
  var velocity = this.velocity;
  var angularVelocity = this.angularVelocity;
  var outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase)
  var frictionForce = -this.mu*velocity;
  var springForce =  -this.k*blockPosX;
  var acceleration = (outerForce+frictionForce+springForce)/this.mass;
  this.memory.push({blockPosX: blockPosX});

  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    time = time + this.deltaTime;
    velocity = velocity+acceleration*this.deltaTime;
    blockPosX = blockPosX+velocity*this.deltaTime;
    outerForce = -this.f0*Math.sin(angularVelocity*time+this.phase)
    frictionForce = -this.mu*velocity;
    springForce =  -this.k*blockPosX;
    acceleration = (outerForce+frictionForce+springForce)/this.mass;
    this.memory.push({blockPosX: blockPosX});
  }
};

NPEngine.ForcedSpring.prototype.onReady = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.convertedBlockPosX = this.grid.convertToVectorValueX(this.memory[0].blockPosX);
};

NPEngine.ForcedSpring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
};

NPEngine.ForcedSpring.prototype.onStop = function() {
};

NPEngine.ForcedSpring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.ForcedSpring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 6;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();

  context.beginPath();
  context.lineWidth = 1;
  context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.ForcedSpring.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.ForcedSpring.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.ForcedSpring.prototype.setF0 = function (value) {
  this.f0 = value;
};

NPEngine.ForcedSpring.prototype.setWW0 = function (value) {
  this.ww0 = value;
};

NPEngine.ForcedSpring.prototype.setPhase = function (value) {
  this.phase = value;
};

NPEngine.ForcedSpring.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.ForcedSpring.prototype.setX = function (value) {
  this.block.center.x = value;
};

NPEngine.Kepler = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.01;   // seconds
  this.slowFactor = 3;

  this.G = 1.18e-19;
  this.earthMass = 1;
  this.sunMass = 332965;
  this.moonMass = 0.012321;

  this.augmentedFactor = 30;
  this.earthVelocityX = 0;
  this.earthVelocityY = 1.95e-7;
  this.earthX = 1.013333;
  this.earthY = 0;
  this.moonVelocityX = 0;
  this.moonVelocityY = 2.02e-7;
  this.moonX = 1.015896;
  this.moonY = 0;
};

NPEngine.Kepler.prototype.constructor = NPEngine.Kepler;
NPEngine.Kepler.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.Kepler.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.Kepler.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.Kepler.prototype.compute = function () {
  this.memory = [];

  var earthX = this.earthX;
  var earthY = this.earthY;
  var moonX = this.moonX;
  var moonY = this.moonY;
  var sunEarthDistance = Math.sqrt(earthX*earthX+earthY*earthY);
  var sunMoonDistance = Math.sqrt(moonX*moonX+moonY*moonY);
  var moonEarthDistance = Math.sqrt((moonX-earthX)*(moonX-earthX)+(moonY-earthY)*(moonY-earthY));
  var earthVelocityX = this.earthVelocityX;
  var earthVelocityY = this.earthVelocityY;
  var moonVelocityX = this.moonVelocityX;
  var moonVelocityY = this.moonVelocityY;
  var sunEarthForceX = -this.G*this.sunMass*this.earthMass*earthX/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
  var sunEarthForceY = -this.G*this.sunMass*this.earthMass*earthY/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
  var earthMoonForceX = -this.G*this.earthMass*this.moonMass*(moonX-earthX)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
  var earthMoonForceY = -this.G*this.earthMass*this.moonMass*(moonY-earthY)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
  var sunMoonForceX = -this.G*this.sunMass*this.moonMass*moonX/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
  var sunMoonForceY = -this.G*this.sunMass*this.moonMass*moonY/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
  var earthForceX = sunEarthForceX-earthMoonForceX;
  var earthForceY = sunEarthForceY-earthMoonForceY;
  var moonForceX = sunMoonForceX+earthMoonForceX;
  var moonForceY = sunMoonForceY+earthMoonForceY;

  var augmentedMoonX = earthX+this.augmentedFactor*(moonX-earthX);
  var augmentedMoonY = earthY+this.augmentedFactor*(moonY-earthY);

  this.memory.push({
    earthX: earthX,
    earthY: earthY,
    moonX: augmentedMoonX,
    moonY: augmentedMoonY
  });

  for (var i= 1; i<10000; i++) {
    earthVelocityX = earthVelocityX+earthForceX/this.earthMass*1*24*3600;
    earthVelocityY = earthVelocityY+earthForceY/this.earthMass*1*24*3600;
    earthX = earthX+earthVelocityX*1*24*3600;
    earthY = earthY+earthVelocityY*1*24*3600;

    moonVelocityX = moonVelocityX+moonForceX/this.moonMass*1*24*3600;
    moonVelocityY = moonVelocityY+moonForceY/this.moonMass*1*24*3600;
    moonX = moonX+moonVelocityX*1*24*3600;
    moonY = moonY+moonVelocityY*1*24*3600;

    sunEarthDistance = Math.sqrt(earthX*earthX+earthY*earthY);
    sunMoonDistance = Math.sqrt(moonX*moonX+moonY*moonY);
    moonEarthDistance = Math.sqrt((moonX-earthX)*(moonX-earthX)+(moonY-earthY)*(moonY-earthY));
    sunEarthForceX = -this.G*this.sunMass*this.earthMass*earthX/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
    sunEarthForceY = -this.G*this.sunMass*this.earthMass*earthY/(sunEarthDistance*sunEarthDistance*sunEarthDistance);
    earthMoonForceX = -this.G*this.earthMass*this.moonMass*(moonX-earthX)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
    earthMoonForceY = -this.G*this.earthMass*this.moonMass*(moonY-earthY)/(moonEarthDistance*moonEarthDistance*moonEarthDistance);
    sunMoonForceX = -this.G*this.sunMass*this.moonMass*moonX/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
    sunMoonForceY = -this.G*this.sunMass*this.moonMass*moonY/(sunMoonDistance*sunMoonDistance*sunMoonDistance);
    earthForceX = sunEarthForceX-earthMoonForceX;
    earthForceY = sunEarthForceY-earthMoonForceY;
    moonForceX = sunMoonForceX+earthMoonForceX;
    moonForceY = sunMoonForceY+earthMoonForceY;

    augmentedMoonX = earthX+this.augmentedFactor*(moonX-earthX);
    augmentedMoonY = earthY+this.augmentedFactor*(moonY-earthY);

    this.memory.push({
      earthX: earthX,
      earthY: earthY,
      moonX: augmentedMoonX,
      moonY: augmentedMoonY
    });
  }
};

NPEngine.Kepler.prototype.onReady = function() {
  var data = this.memory[0];
  this.curEarthX = this.grid.convertToVectorValueX(data.earthX);
  this.curEarthY = this.grid.convertToVectorValueY(data.earthY);
  this.curMoonX = this.grid.convertToVectorValueX(data.moonX);
  this.curMoonY = this.grid.convertToVectorValueY(data.moonY);
};

NPEngine.Kepler.prototype.onStart = function() {
};

NPEngine.Kepler.prototype.onResume = function() {
};

NPEngine.Kepler.prototype.onPause = function() {
};

NPEngine.Kepler.prototype.onStop = function() {
};

NPEngine.Kepler.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(10*this.slowFactor)); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curEarthX = this.grid.convertToVectorValueX(data.earthX);
  this.curEarthY = this.grid.convertToVectorValueY(data.earthY);
  this.curMoonX = this.grid.convertToVectorValueX(data.moonX);
  this.curMoonY = this.grid.convertToVectorValueY(data.moonY);
};

NPEngine.Kepler.prototype.render = function (context) {
  context.beginPath();
  context.arc(this.grid.convertToVectorValueX(0), this.grid.convertToVectorValueY(0), 20, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(this.curEarthX, this.curEarthY, 8, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(this.curMoonX, this.curMoonY, 3, 0, 2*Math.PI, false);
  context.fill();
  context.stroke();
};

NPEngine.Kepler.prototype.setSlowFactor = function(value) {
  this.slowFactor = value;
};

NPEngine.Kepler.prototype.setAugmentedFactor = function(value) {
  this.augmentedFactor = value;
};

NPEngine.ParabolicMotion = function() {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.deltaTime  = 0.01;        // second

  // initial variables
  this.gravity    = 9.8;        // m/s^2
  this.mass       = 1;          // kg
  this.theta      = 0.785398;   // rad
  this.velocity   = 70;         // m/s
  this.mu         = 0.1;        // friction constant

  // initial positions
  this.ball = new NPEngine.Point(0, 0);

  // moving position
  this.curBall = new NPEngine.Point;
};

NPEngine.ParabolicMotion.prototype.constructor = NPEngine.ParabolicMotion;
NPEngine.ParabolicMotion.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.ParabolicMotion.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.ParabolicMotion.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.ParabolicMotion.prototype.compute = function () {
  this.trace = [];
  this.memory = [];
  var ballX = this.ball.x;
  var ballY = this.ball.y;
  var velocityX = this.velocity*Math.cos(this.theta);
  var velocityY = this.velocity*Math.sin(this.theta);
  var forceX = -this.mu*velocityX;
  var forceY = -this.mu*velocityY - this.mass*this.gravity;
  this.memory.push({
    time: 0,
    ballX: ballX,
    ballY: ballY
  });

  for (var i=1; i<10000; i++) {
    ballX = ballX+this.deltaTime*velocityX;
    ballY = ballY+this.deltaTime*velocityY;
    velocityX = velocityX+forceX/this.mass*this.deltaTime;
    velocityY = velocityY+forceY/this.mass*this.deltaTime;
    forceX = -this.mu*velocityX;
    forceY = -this.mu*velocityY - this.mass*this.gravity;
    this.memory.push({
      time: i,
      ballX: ballX,
      ballY: ballY
    })
  }
};

NPEngine.ParabolicMotion.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
};

NPEngine.ParabolicMotion.prototype.onStart = function() {
};

NPEngine.ParabolicMotion.prototype.onResume = function() {
};

NPEngine.ParabolicMotion.prototype.onPause = function() {
};

NPEngine.ParabolicMotion.prototype.onStop = function() {
};

NPEngine.ParabolicMotion.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime*1000)); // convert millisecond to 0.01 second

  if (gap < 10000) {
    var data = this.memory[gap];
    var ballX = this.grid.convertToVectorValueX(data.ballX);
    var ballY = this.grid.convertToVectorValueY(data.ballY);

    // boundary check
    if (ballY > this.viewHeight) {
      return ;
    }
    this.curBall.x = ballX;
    this.curBall.y = ballY;

    // trace line
    this.trace.push({
      x: ballX,
      y: ballY
    });
  }
};

NPEngine.ParabolicMotion.prototype.render = function (context) {
  // draw trace
  context.beginPath();
  context.moveTo(this.grid.convertToVectorValueX(0), this.grid.convertToVectorValueY(0));
  context.lineWidth = 1;
  for (var i=0; i<this.trace.length; i++) {
    context.lineTo(this.trace[i].x, this.trace[i].y);
  }
  context.stroke();

  context.beginPath();
  context.arc(this.curBall.x, this.curBall.y, 10, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.ParabolicMotion.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.ParabolicMotion.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.ParabolicMotion.prototype.setAngle = function (value) {
  this.theta = NPEngine.Convert.toRadians(value);
};

NPEngine.ParabolicMotion.prototype.setVelocity = function (value) {
  this.velocity = value;   // m/s
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



NPEngine.Pendulum.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.pivot.x = Math.round(viewWidth/2);
  this.pivot.y = 0;
  this.timeBoard = timeBoard;
};

NPEngine.Pendulum.prototype.compute = function () {
  this.memory = [];
  if (this.theta0 < 0.5) { /* theta0 is less than about 30 degrees */
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
  }
  else { /* for theta0 !<< 1 */
    // for performance, I apply uncommon algorithm.
    var flag = false;             // it is used if it is after half or before half
    var isSignPositive = false;
    if (this.theta0 > 0) {
      isSignPositive = true;
    }

    var velocity = 0;
    var circumference = this.length * this.theta0;
    var firstCircumference = circumference;
    var lastGap = Number.MAX_VALUE;

    for (var i=0; ; i++) {
      velocity = velocity+(-this.gravity*Math.sin(circumference/this.length))*this.deltaTime;
      circumference = circumference+velocity*this.deltaTime;
      var thetaValue = circumference/this.length;
      var xValue = this.length*Math.sin(thetaValue).toFixed(6);
      var yValue = this.length*Math.cos(thetaValue).toFixed(6);
      this.memory.push({time: i, theta: thetaValue, x: xValue, y: yValue});

      if (flag == false) {
        if ((circumference>0) != isSignPositive) {
          flag = true;
        }
      }
      else {
        if ((circumference>0) == isSignPositive) {
          var gap = Math.abs(firstCircumference - circumference);
          if (lastGap < gap) {
            this.period = i;
            return ;
          }
          else {
            lastGap = gap;
          }
        }
      }
    }
  }
};

NPEngine.Pendulum.prototype.onReady = function() {
  this.curCircle.x = this.memory[0].x;
  this.curCircle.y = this.memory[0].y;
};

NPEngine.Pendulum.prototype.onStart = function() {
};

NPEngine.Pendulum.prototype.onResume = function() {
};

NPEngine.Pendulum.prototype.onPause = function() {
};

NPEngine.Pendulum.prototype.onStop = function() {
};

NPEngine.Pendulum.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime*1000)); // millisecond to 0.01 second
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
NPEngine.PendulumCollision = function() {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.deltaTime  = 0.0005;        // second

  // initial variables
  this.gravity          = 9.8;        // m/s^2
  this.mass             = 0.5;        // kg
  this.lineLength       = 1;          // m
  this.k                = 1000000;    // N/m
  this.mu               = 10;         // N s/m
  this.diameter1        = 0.1;        // m
  this.diameter2        = 0.1;        // m
  this.theta1           = 0;          // rad
  this.theta2           = NPEngine.Convert.toRadians(45);   // rad
//  this.circumference1   = this.lineLength*this.theta1;          // m
//  this.circumference2   = this.lineLength*this.theta2;          // m
  this.angularVelocity1 = 0;
  this.angularVelocity2 = 0;

  // initial position
  this.pivot1 = new NPEngine.Point;
  this.pivot2 = new NPEngine.Point;

  this.ratio = Math.pow(2, 8);
};

NPEngine.PendulumCollision.prototype.constructor = NPEngine.PendulumCollision;
NPEngine.PendulumCollision.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.PendulumCollision.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.timeBoard = timeBoard;
};

NPEngine.PendulumCollision.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.PendulumCollision.prototype.compute = function () {
  this.memory = [];
  this.pivot1.x = Math.round(this.width/2-this.ratio*this.diameter1);
  this.pivot1.y = 0;
  this.pivot2.x = Math.round(this.width/2+this.ratio*this.diameter2);
  this.pivot2.y = 0;

  var inertia = this.mass*this.lineLength*this.lineLength;  // moment of inertia
  var theta1 = this.theta1;
  var theta2 = this.theta2;
  var angularVelocity1 = this.angularVelocity1;
  var angularVelocity2 = this.angularVelocity2;
  var impulsiveForce = theta1>theta2 ? this.k*(theta1-theta2)*this.lineLength+this.mu*this.lineLength*(angularVelocity1-angularVelocity2) : 0;
  var torque1 = -this.mass*this.gravity*this.lineLength*Math.sin(theta1)-this.lineLength*impulsiveForce;
  var torque2 = -this.mass*this.gravity*this.lineLength*Math.sin(theta2)+this.lineLength*impulsiveForce;
  this.memory.push({
    time: 0,
    theta1: theta1,
    theta2: theta2
  });

  var memoryFlag = 1;
  for (var i=this.deltaTime; i<200000; i++) {
    impulsiveForce = theta1>theta2 ? this.k*(theta1-theta2)*this.lineLength+this.mu*this.lineLength*(angularVelocity1-angularVelocity2) : 0;
    torque1 = -this.mass*this.gravity*this.lineLength*Math.sin(theta1)-this.lineLength*impulsiveForce;
    torque2 = -this.mass*this.gravity*this.lineLength*Math.sin(theta2)+this.lineLength*impulsiveForce;

    angularVelocity1 = angularVelocity1+torque1/inertia*this.deltaTime;
    angularVelocity2 = angularVelocity2+torque2/inertia*this.deltaTime;
    theta1 = theta1+angularVelocity1*this.deltaTime;
    theta2 = theta2+angularVelocity2*this.deltaTime;
    if (memoryFlag==20) {
      memoryFlag=1;
      this.memory.push({
        time: i,
        theta1: theta1,
        theta2: theta2
      });
    }
    else {
      memoryFlag++;
    }
  }
};

NPEngine.PendulumCollision.prototype.onReady = function() {
  this.ball1 = new NPEngine.Point(this.lineLength*Math.sin(this.theta1), this.lineLength*Math.cos(this.theta1));
  this.ball2 = new NPEngine.Point(this.lineLength*Math.sin(this.theta2), this.lineLength*Math.cos(this.theta2));
};

NPEngine.PendulumCollision.prototype.onStart = function() {
};

NPEngine.PendulumCollision.prototype.onResume = function() {
};

NPEngine.PendulumCollision.prototype.onPause = function() {
};

NPEngine.PendulumCollision.prototype.onStop = function() {
};

NPEngine.PendulumCollision.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10);

  this.ball1.x = this.lineLength*Math.sin(this.memory[gap].theta1);
  this.ball1.y = this.lineLength*Math.cos(this.memory[gap].theta1);
  this.ball2.x = this.lineLength*Math.sin(this.memory[gap].theta2);
  this.ball2.y = this.lineLength*Math.cos(this.memory[gap].theta2);
};

NPEngine.PendulumCollision.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot1.x, this.pivot1.y);
  context.lineTo(this.pivot1.x+this.ratio*this.ball1.x, this.pivot1.y+this.ratio*this.ball1.y);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot1.x+this.ratio*this.ball1.x, this.pivot1.y+this.ratio*this.ball1.y, this.ratio*this.diameter1, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();

  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(this.pivot2.x, this.pivot2.y);
  context.lineTo(this.pivot2.x+this.ratio*this.ball2.x, this.pivot2.y+this.ratio*this.ball2.y);
  context.stroke();

  context.beginPath();
  context.arc(this.pivot2.x+this.ratio*this.ball2.x, this.pivot2.y+this.ratio*this.ball2.y, this.ratio*this.diameter2, 0, 2*Math.PI, true);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};



NPEngine.PendulumCollision.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.PendulumCollision.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.PendulumCollision.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.PendulumCollision.prototype.setDiameter1 = function (value) {
  this.diameter1 = value;
};

NPEngine.PendulumCollision.prototype.setDiameter2 = function (value) {
  this.diameter2 = value;
};

NPEngine.PendulumCollision.prototype.setAngle1 = function (value) {
  this.theta1 = NPEngine.Convert.toRadians(value);
};

NPEngine.PendulumCollision.prototype.setAngle2 = function (value) {
  this.theta2 = NPEngine.Convert.toRadians(value);
};
NPEngine.PendulumCollision3 = function() {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.deltaTime        = 0.00001;     // second

  // initial variables
  this.numOfPendulum    = 3;          // number
  this.gravity          = 9.8;        // m/s^2
  this.mass             = 0.5;        // kg
  this.lineLength       = 1;          // m
  this.k                = 5000000;    // N/m
  this.mu               = 0;          // N s/m

  this.diameter         = 0.1;        // m
  this.theta            = [];         // radian
  this.thetaBias        = 0.002;      // radian
  this.angularVelocity  = [];         // m/s
  this.pivot            = [];         // point
  this.ball = [];
  this['theta'+(this.numOfPendulum)] = NPEngine.Convert.toRadians(45);

  this.ratio = Math.pow(2, 8);
};

NPEngine.PendulumCollision3.prototype.constructor = NPEngine.PendulumCollision3;
NPEngine.PendulumCollision3.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.PendulumCollision3.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.timeBoard = timeBoard;
};

NPEngine.PendulumCollision3.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.PendulumCollision3.prototype.compute = function () {
  this.memory = [];

  // init values
  this.theta            = [];
  this.angularVelocity  = [];
  this.pivot            = [];
  this.ball             = [];
  for (var i=0, theta=0; i<this.numOfPendulum; i++) {
    if (this.hasOwnProperty('theta'+(i+1)))
      this.theta.push(this['theta'+(i+1)]);
    else
      this.theta.push(0);
    this.angularVelocity.push(0);
    this.pivot.push(new NPEngine.Point);
    this.ball.push(new NPEngine.Point);
  }

  for (var i=0; i<this.numOfPendulum; i++) {
    if (this.hasOwnProperty('theta'+(i+1))) {
      this.theta[i] = this['theta'+(i+1)];
    }
  }

  // compute values
  var centerWidth = this.width/2;
  if (this.numOfPendulum%2 == 0) {
    this.pivot[(this.numOfPendulum/2)-1].x = centerWidth-this.ratio*this.diameter;
    this.pivot[this.numOfPendulum/2].x = centerWidth+this.ratio*this.diameter;
    if (this.numOfPendulum > 2) {
      this.pivot[(this.numOfPendulum/2)-1].x = centerWidth-this.ratio*this.diameter;
      for (var i=0; i<this.numOfPendulum/2-1; i++) {
        this.pivot[(this.numOfPendulum/2)-2-i].x = centerWidth-(this.ratio*this.diameter*2*(i+1))-this.ratio*this.diameter;
      }
      this.pivot[(this.numOfPendulum/2)].x = centerWidth+this.ratio*this.diameter;
      for (var i=0; i<this.numOfPendulum/2-1; i++) {
        this.pivot[(this.numOfPendulum/2)+1+i].x = centerWidth+(this.ratio*this.diameter*2*(i+1))+this.ratio*this.diameter;
      }
    }
  }
  else {
    this.pivot[(this.numOfPendulum-1)/2].x = centerWidth;
    if (this.numOfPendulum >= 3) {
      this.pivot[(this.numOfPendulum-1)/2-1].x = centerWidth-(this.ratio*this.diameter*2);
      this.pivot[(this.numOfPendulum-1)/2+1].x = centerWidth+(this.ratio*this.diameter*2);
    }
    if (this.numOfPendulum >=5) {
      for (var i=0; i<(this.numOfPendulum-1)/2-1; i++) {
        this.pivot[(this.numOfPendulum-1)/2-2-i].x = centerWidth-(this.ratio*this.diameter*(2*i+4));
        this.pivot[(this.numOfPendulum-1)/2+2+i].x = centerWidth+(this.ratio*this.diameter*(2*i+4));
      }
    }
  }

  for (var i=0; i<this.numOfPendulum; i++) {
    this.pivot[i].y = 0;
  }

  var inertia = this.mass*this.lineLength*this.lineLength;  // moment of inertia
  var theta = this.theta.slice(0);
  var angularVelocity = this.angularVelocity.slice(0);
  var impulsiveForce = [];
  for (var i=0; i<this.numOfPendulum-1; i++) {
    impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
  }

  var torque = [];
  torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
  for (var i=1; i<this.numOfPendulum-1; i++) {
    torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
  }
  torque[this.numOfPendulum-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.numOfPendulum-1])+this.lineLength*impulsiveForce[this.numOfPendulum-2];

  var data = {};
  for (var i=0; i<this.numOfPendulum; i++) {
    data['theta'+(i+1)] = theta[i];
  }
  this.memory.push(data);

  var memoryFlag = 1;
  for (var j=0; j<6000000; j++) {
    for (var i=0; i<this.numOfPendulum-1; i++) {
      impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
    }

    torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
    for (var i=1; i<this.numOfPendulum-1; i++) {
      torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
    }
    torque[this.numOfPendulum-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.numOfPendulum-1])+this.lineLength*impulsiveForce[this.numOfPendulum-2];

    for (var i=0; i<this.numOfPendulum; i++) {
      angularVelocity[i] = angularVelocity[i]+torque[i]/inertia*this.deltaTime;
    }

    for (var i=0; i<this.numOfPendulum; i++) {
      theta[i] = theta[i]+angularVelocity[i]*this.deltaTime;
    }

    if (memoryFlag==1000) {
      memoryFlag=1;
      var data = {};
      for (var i=0; i<this.numOfPendulum; i++) {
        data['theta'+(i+1)] = theta[i];
      }
      this.memory.push(data);
    }
    else {
      memoryFlag++;
    }
  }
};

NPEngine.PendulumCollision3.prototype.onReady = function() {
  for (var i=0; i<this.numOfPendulum; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.theta[i]);
    this.ball[i].y = this.lineLength*Math.cos(this.theta[i]);
  }
};

NPEngine.PendulumCollision3.prototype.onStart = function() {
};

NPEngine.PendulumCollision3.prototype.onResume = function() {
};

NPEngine.PendulumCollision3.prototype.onPause = function() {
};

NPEngine.PendulumCollision3.prototype.onStop = function() {
};

NPEngine.PendulumCollision3.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10);

  for (var i=0; i<this.numOfPendulum; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.memory[gap]['theta'+(i+1)]);
    this.ball[i].y = this.lineLength*Math.cos(this.memory[gap]['theta'+(i+1)]);
  }
};

NPEngine.PendulumCollision3.prototype.render = function (context) {
  for (var i=0; i<this.numOfPendulum; i++) {
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(this.pivot[i].x, this.pivot[i].y);
    context.lineTo(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
    context.stroke();

    context.beginPath();
    context.arc(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y, this.ratio*this.diameter, 0, 2*Math.PI, true);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
  }

  // draw pendulum number
  context.beginPath();
  context.font = '34pt Calibri';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (var i=0; i<this.numOfPendulum; i++) {
    context.fillText(String(i+1), this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
  }
  context.stroke();
};

NPEngine.PendulumCollision3.prototype.setNumOfPendulum = function (value) {
  this.numOfPendulum = value;
};

NPEngine.PendulumCollision3.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.PendulumCollision3.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.PendulumCollision3.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.PendulumCollision3.prototype.setAngleByIndex = function (value, index) {
  this['theta'+(index+1)] = NPEngine.Convert.toRadians(value);
};
NPEngine.RotationMotion = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.0002;

  this.ballMass = 1.1;        // kg
  this.gravity = 9.8;         // m/s^2
  this.blockMass = 10;        // kg
  this.k = 200000;            // N/m

  this.ballRadius = 0.1;      // m
  this.blockWidth = 0.3;      // m
  this.blockHeight = 0.5;     // m
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block = new NPEngine.Point(0, this.blockHeight);
  this.blockCollisionPoint = new NPEngine.Point(this.blockWidth, this.blockHeight);
  this.ball = new NPEngine.Point(0.5, this.blockHeight);
  this.ballVelocityX = -3;      // m/s
  this.ballVelocityY = 0;       // m/s

  this.curBall = this.ball.clone();
  this.curBlock = this.block.clone();
};

NPEngine.RotationMotion.prototype.constructor = NPEngine.RotationMotion;
NPEngine.RotationMotion.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.RotationMotion.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.RotationMotion.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.RotationMotion.prototype.compute = function () {
  this.memory = [];

  var ball = this.ball.clone();
  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;

  var theta = -this.theta0;
  var angularVelocity = 0;
  var collisionPoint = this.blockCollisionPoint.clone();
  var distance = Math.sqrt((ball.x-collisionPoint.x)*(ball.x-collisionPoint.x)+(ball.y-collisionPoint.y)*(ball.y-collisionPoint.y));
  var forceX = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(collisionPoint.x-ball.x)/distance : 0;
  var forceY = distance<this.ballRadius ? this.k*(this.ballRadius-distance)*(collisionPoint.y-ball.y)/distance : 0;
  var torque = collisionPoint.x*forceY-collisionPoint.y*forceX + (theta>-this.theta0 ? 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) : 0);

  this.memory.push({
    ballX: ball.x,
    ballY: ball.y,
    theta: -(theta+this.theta0)
  });

  var radian90 = NPEngine.Convert.toRadians(90)-this.theta0;
  var count = 1;
  var flag = 0.01/this.deltaTime;
  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    ballVelocityX = ballVelocityX - forceX / this.ballMass * this.deltaTime;
    ballVelocityY = ballVelocityY - forceY / this.ballMass * this.deltaTime;
    ball.x = ball.x + ballVelocityX * this.deltaTime;
    ball.y = ball.y + ballVelocityY * this.deltaTime;

    angularVelocity = (theta < -this.theta0 || theta > radian90) ? 0 : angularVelocity + torque / this.momentOfInertia * this.deltaTime;
    theta = theta + angularVelocity * this.deltaTime;
    collisionPoint.x = this.blockDiagonalHeight*Math.sin(-theta);
    collisionPoint.y = this.blockDiagonalHeight*Math.cos(theta);
    distance = Math.sqrt((ball.x - collisionPoint.x) * (ball.x - collisionPoint.x) + (ball.y - collisionPoint.y) * (ball.y - collisionPoint.y));
    forceX = distance < this.ballRadius ? this.k * (this.ballRadius - distance) * (collisionPoint.x - ball.x) / distance : 0;
    forceY = distance < this.ballRadius ? this.k * (this.ballRadius - distance) * (collisionPoint.y - ball.y) / distance : 0;
    torque = collisionPoint.x * forceY - collisionPoint.y * forceX + (theta > -this.theta0 ? 0.5 * this.blockMass * this.gravity * this.blockDiagonalHeight * Math.sin(theta) : 0);

    if (count == flag) {
      this.memory.push({
        ballX: ball.x,
        ballY: ball.y,
        theta: -(theta+this.theta0)
    });
      count = 1;
    }
    else {
      count++;
    }
  }
};

NPEngine.RotationMotion.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;

  this.curBlock.x = this.grid.convertToVectorValueX(this.block.x);
  this.curBlock.y = this.grid.convertToVectorValueY(this.block.y);
  this.convertedBallRadius = this.grid.convertToGridScalaValue(this.ballRadius);
  this.convertedBlockWidth = this.grid.convertToGridScalaValue(this.blockWidth);
  this.convertedBlockHeight = this.grid.convertToGridScalaValue(this.blockHeight);
};

NPEngine.RotationMotion.prototype.onStart = function() {
};

NPEngine.RotationMotion.prototype.onResume = function() {
};

NPEngine.RotationMotion.prototype.onPause = function() {
};

NPEngine.RotationMotion.prototype.onStop = function() {
};

NPEngine.RotationMotion.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;
};

NPEngine.RotationMotion.prototype.render = function (context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall.x, this.curBall.y, this.convertedBallRadius, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.translate(this.grid.centerWidth, this.grid.centerHeight);
  context.rotate(this.curTheta);
  context.translate(-this.grid.centerWidth, -this.grid.centerHeight);
  context.fillRect(this.curBlock.x, this.curBlock.y, this.convertedBlockWidth, this.convertedBlockHeight);
  context.stroke();
  context.restore();
};

NPEngine.RotationMotion.prototype.setBallMass = function(value) {
  this.ballMass = value;
};

NPEngine.RotationMotion.prototype.setBlockMass = function(value) {
  this.blockMass = value;
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
};

NPEngine.RotationMotion.prototype.setK = function(value) {
  this.k = value;
};

NPEngine.RotationMotion.prototype.setBallRadius = function(value) {
  this.ballRadius = value;
};

NPEngine.RotationMotion.prototype.setBlockWidth = function(value) {
  this.blockWidth = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도
  this.blockCollisionPoint.x = this.blockWidth;
};

NPEngine.RotationMotion.prototype.setBlockHeight = function(value) {
  this.blockHeight = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block.y = this.blockHeight;
  this.blockCollisionPoint.y = this.blockHeight;
  this.ball.y = this.blockHeight;
};

NPEngine.RotationMotion.prototype.setBallX = function(value) {
  this.ball.x = value;
};

NPEngine.RotationMotion.prototype.setBallV = function(value) {
  this.ballVelocityX = value;
};
NPEngine.RotationMotionPlus = function() {
  NPEngine.DisplayObject.call(this);

  this.deltaTime = 0.0005;

  this.ballMass = 1.1;        // kg
  this.gravity = 9.8;         // m/s^2
  this.blockMass = 50;        // kg
  this.k = 1000000;           // N/m

  this.ballRadius = 0.1;      // m
  this.blockWidth = 0.3;      // m
  this.blockHeight = 2;       // m
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);

  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.ballX = 8;             // m
  this.ballY = 0.1;           // m

  this.incidenceAngle = NPEngine.Convert.toRadians(40);     // rad
  this.incidenceVelocity = 10;                              // m/s
  this.ballVelocityX = -this.incidenceVelocity * Math.cos(this.incidenceAngle);
  this.ballVelocityY = this.incidenceVelocity * Math.sin(this.incidenceAngle);
  alert (this.ballVelocityX + ", " + this.ballVelocityY);
  this.coefficientOfFrictionBall = 300;         // N s/m
  this.coefficientOfFrictionBlock = 2000;       // N s/m

  // Graphic variables
  this.block = new NPEngine.Point(0, this.blockHeight);
  this.curBall = new NPEngine.Point(this.ballX, this.ballY);
  this.curBlock = this.block.clone();
};

NPEngine.RotationMotionPlus.prototype.constructor = NPEngine.RotationMotionPlus;
NPEngine.RotationMotionPlus.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.RotationMotionPlus.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
};

NPEngine.RotationMotionPlus.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.RotationMotionPlus.prototype.compute = function () {
  this.memory = [];

  var radian90 = NPEngine.Convert.toRadians(90)-this.theta0;

  var theta = -this.theta0;
  var blockCollisionX = this.blockDiagonalHeight*Math.sin(-theta);
  var blockCollisionY = this.blockDiagonalHeight*Math.cos(theta);

  var blockEndX = -this.blockDiagonalHeight*Math.sin(theta);
  var blockEndY = this.blockDiagonalHeight*Math.cos(theta);

  var ballX = this.ballX;
  var ballY = this.ballY;

  var ballVelocityX = this.ballVelocityX;
  var ballVelocityY = this.ballVelocityY;

  var angularVelocity = 0;
  var distance = Math.sqrt((ballX-blockCollisionX)*(ballX-blockCollisionX) + (ballY-blockCollisionY)*(ballY-blockCollisionY));

  var flag = (Math.abs(ballX-blockCollisionX)<this.ballRadius && ballY<=this.blockHeight && ballY>0) ? 1 : 0;
  var ballFlag = ballY < this.ballRadius ? 1 : 0;
  var blockFlag = theta > radian90 ? 1 : 0;

  var forceBlockX = this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (this.k*this.blockHeight*(theta-radian90)*Math.cos(theta)+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity*Math.cos(theta))*blockFlag;
  var forceBlockY = this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag + (this.k*this.blockHeight*(theta-radian90)*Math.sin(theta)+this.coefficientOfFrictionBlock*this.blockHeight*angularVelocity*Math.sin(theta))*blockFlag;

  var torqueFlag = theta > -this.theta0 ? 1 : 0;
  var torque = (blockCollisionX*forceBlockY-blockCollisionY*forceBlockX) + 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) * torqueFlag;

  var forceBallX = -this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (-this.coefficientOfFrictionBall*ballVelocityX*ballFlag);
  var forceBallY = -this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag - this.ballMass*this.gravity + (-this.k*(ballY-this.ballRadius)-this.coefficientOfFrictionBall*ballVelocityY)*ballFlag;

  this.memory.push({
    ballX: ballX,
    ballY: ballY,
//    theta: -(theta+this.theta0)
    theta: theta
  });

  var nhk = 1;
  var ele = document.getElementById("output");
  var count = 1;
  var countFlag = 0.01/this.deltaTime;
  for (var i= 1, max=(1/this.deltaTime)*100; i<max; i++) {
    angularVelocity = theta < -this.theta0 ? 0 : angularVelocity + torque / this.momentOfInertia * this.deltaTime;

    theta = theta + angularVelocity * this.deltaTime;
    blockCollisionX = this.blockDiagonalHeight * Math.sin(-theta);

    ballX = ballX + ballVelocityX * this.deltaTime;
    ballY = ballY + ballVelocityY * this.deltaTime;
    flag = (Math.abs(ballX - blockCollisionX) < this.ballRadius && ballY < this.blockHeight && ballY > 0) ? 1 : 0;
    blockCollisionY = flag == 1 ? ballY : blockCollisionY;

    blockEndX = -this.blockDiagonalHeight * Math.sin(theta);
    blockEndY = this.blockDiagonalHeight * Math.cos(theta);

    ballVelocityX = ballVelocityX + forceBallX / this.ballMass * this.deltaTime;
    ballVelocityY = ballVelocityY + forceBallY / this.ballMass * this.deltaTime;

    distance = Math.sqrt((ballX - blockCollisionX) * (ballX - blockCollisionX) + (ballY - blockCollisionY) * (ballY - blockCollisionY));

    ballFlag = ballY < this.ballRadius ? 1 : 0;
    blockFlag = theta > Math.PI/2 ? 1 : 0;

    forceBlockX = this.k * (this.ballRadius - distance) * (blockCollisionX - ballX) / distance * flag + (this.k * this.blockHeight * (theta - Math.PI/2) * Math.cos(theta) + this.coefficientOfFrictionBlock * this.blockHeight * angularVelocity * Math.cos(theta)) * blockFlag;
    forceBlockY = this.k * (this.ballRadius - distance) * (blockCollisionY - ballY) / distance * flag + (this.k * this.blockHeight * (theta - Math.PI/2) * Math.sin(theta) + this.coefficientOfFrictionBlock * this.blockHeight * angularVelocity * Math.sin(theta)) * blockFlag;

    torqueFlag = theta > -this.theta0 ? 1 : 0;
    torque = (blockCollisionX*forceBlockY-blockCollisionY*forceBlockX) + 0.5*this.blockMass*this.gravity*this.blockDiagonalHeight*Math.sin(theta) * torqueFlag;
  if (nhk == 1984) {
    debugger;
    alert(blockCollisionX*forceBlockY-blockCollisionY*forceBlockX);
  }
    forceBallX = -this.k*(this.ballRadius-distance)*(blockCollisionX-ballX)/distance*flag + (-this.coefficientOfFrictionBall*ballVelocityX*ballFlag);
    forceBallY = -this.k*(this.ballRadius-distance)*(blockCollisionY-ballY)/distance*flag - this.ballMass*this.gravity + (-this.k*(ballY-this.ballRadius)-this.coefficientOfFrictionBall*ballVelocityY)*ballFlag;
////    debugger;
//    if ( nhk >= 2000 && nhk < 3000) {
//      var namhoon = ele.innerHTML;
//      ele.innerHTML = namhoon + "\n" + blockCollisionX + "," + blockCollisionY + "," + ballX + "," + ballY + "," + theta + "," + ballVelocityX + "," + ballVelocityY + "," + angularVelocity + "," + distance + "," + flag + "," + forceBlockX + "," + forceBlockY + "," + torque + "," + forceBallX + "," + forceBallY + "," + ballFlag + "," + blockFlag;
//    }
    nhk++;
    if (count == countFlag) {
      this.memory.push({
        ballX: ballX,
        ballY: ballY,
//        theta: -(theta+this.theta0)
        theta: theta
      });
      count = 1;
    }
    else {
      count++;
    }
  }
};

NPEngine.RotationMotionPlus.prototype.onReady = function() {
  var data = this.memory[0];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;

  this.curBlock.x = this.grid.convertToVectorValueX(this.block.x);
  this.curBlock.y = this.grid.convertToVectorValueY(this.block.y);
  this.convertedBallRadius = this.grid.convertToGridScalaValue(this.ballRadius);
  this.convertedBlockWidth = this.grid.convertToGridScalaValue(this.blockWidth);
  this.convertedBlockHeight = this.grid.convertToGridScalaValue(this.blockHeight);
};

NPEngine.RotationMotionPlus.prototype.onStart = function() {
};

NPEngine.RotationMotionPlus.prototype.onResume = function() {
};

NPEngine.RotationMotionPlus.prototype.onPause = function() {
};

NPEngine.RotationMotionPlus.prototype.onStop = function() {
};

NPEngine.RotationMotionPlus.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10); // convert millisecond to 0.01 second

  var data = this.memory[gap];
  this.curBall.x = this.grid.convertToVectorValueX(data.ballX);
  this.curBall.y = this.grid.convertToVectorValueY(data.ballY);
  this.curTheta = data.theta;
};

NPEngine.RotationMotionPlus.prototype.render = function (context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.curBall.x, this.curBall.y, this.convertedBallRadius, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.translate(this.grid.centerWidth, this.grid.centerHeight);
  context.rotate(this.curTheta);
  context.translate(-this.grid.centerWidth, -this.grid.centerHeight);
  context.fillRect(this.curBlock.x, this.curBlock.y, this.convertedBlockWidth, this.convertedBlockHeight);
  context.stroke();
  context.restore();
};

NPEngine.RotationMotionPlus.prototype.setBallMass = function(value) {
  this.ballMass = value;
};

NPEngine.RotationMotionPlus.prototype.setBlockMass = function(value) {
  this.blockMass = value;
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
};

NPEngine.RotationMotionPlus.prototype.setK = function(value) {
  this.k = value;
};

NPEngine.RotationMotionPlus.prototype.setBallRadius = function(value) {
  this.ballRadius = value;
};

NPEngine.RotationMotionPlus.prototype.setBlockWidth = function(value) {
  this.blockWidth = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도
  this.blockCollisionPoint.x = this.blockWidth;
};

NPEngine.RotationMotionPlus.prototype.setBlockHeight = function(value) {
  this.blockHeight = value;
  this.blockDiagonalHeight = Math.sqrt(this.blockWidth*this.blockWidth+this.blockHeight*this.blockHeight);
  this.momentOfInertia = 1/3*this.blockMass*this.blockHeight*this.blockHeight;
  this.theta0 = Math.atan(this.blockWidth/this.blockHeight);    // 블록 중심 각도

  this.block.y = this.blockHeight;
  this.blockCollisionPoint.y = this.blockHeight;
  this.ball.y = this.blockHeight;
};

NPEngine.RotationMotionPlus.prototype.setBallX = function(value) {
  this.ball.x = value;
};

NPEngine.RotationMotionPlus.prototype.setBallV = function(value) {
  this.ballVelocityX = value;
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
  this.block.center.x = 1;    // m
  this.block.center.y = 0;    // m/s
  this.velocity = 0;  // m/s
  this.deltaTime = 0.01;
};

NPEngine.Spring.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Spring.prototype.constructor = NPEngine.Spring;



NPEngine.Spring.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.timeBoard = timeBoard;
};

NPEngine.Spring.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
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

NPEngine.Spring.prototype.onReady = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
  this.convertedBlockPosX = this.grid.convertToVectorValueX(this.memory[0].blockPosX);
};

NPEngine.Spring.prototype.onStart = function() {
  this.convertedPivot = this.grid.convertToGridPoint(this.pivot);
  this.halfOfConvertedBlockWidth = parseInt(this.grid.convertToGridScalaValue(this.block.width)/2);
  this.halfOfConvertedBlockHeight = parseInt(this.grid.convertToGridScalaValue(this.block.height)/2);
  this.convertedBlockPosY = this.convertedPivot.y;
};

NPEngine.Spring.prototype.onStop = function() {
};

NPEngine.Spring.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/(this.deltaTime/0.001));

  var data = this.memory[gap];
  this.convertedBlockPosX = this.grid.convertToVectorValueX(data.blockPosX);
};

NPEngine.Spring.prototype.render = function (context) {
  context.beginPath();
  context.lineWidth = 6;
  context.moveTo(this.convertedPivot.x, this.convertedPivot.y);
  context.lineTo(this.convertedBlockPosX, this.convertedBlockPosY);
  context.stroke();

  context.beginPath();
  context.lineWidth = 1;
  context.rect(this.convertedBlockPosX-this.halfOfConvertedBlockWidth, this.convertedBlockPosY-this.halfOfConvertedBlockHeight, this.halfOfConvertedBlockWidth*2, this.halfOfConvertedBlockHeight*2);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

NPEngine.Spring.prototype.setMass = function (value) {
  this.mass = value;
};

NPEngine.Spring.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.Spring.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.Spring.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.Spring.prototype.setX = function (value) {
  this.block.center.x = value;
};

NPEngine.Spring.prototype.setVelocity = function (value) {
  this.velocity = value;
};

NPEngine.CanvasRenderer = function (canvas) {
  this.grid = null;
  this.children = [];

  if (canvas) {
    this.view = canvas;
    this.view.width = canvas.width;
    this.view.height = canvas.height;
  }
  else {
    this.view = canvas || document.createElement("canvas");
    this.view.width = 800;
    this.view.height = 600;
    document.body.appendChild(this.view);
  }
  this.context = this.view.getContext("2d");
  this.timeBoard = new NPEngine.TimeBoard;
};

NPEngine.CanvasRenderer.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.CanvasRenderer.prototype.compute = function() {
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].compute();
  }
};

NPEngine.CanvasRenderer.prototype.onEngineReady = function() {
  this.timeBoard.init();
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onReady();
  }
  this.render();
};

NPEngine.CanvasRenderer.prototype.onEngineStart = function() {
};

NPEngine.CanvasRenderer.prototype.onEngineResume = function() {
  this.timeBoard.resume();
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onStart();
  }
};

NPEngine.CanvasRenderer.prototype.onEnginePause = function() {
  this.timeBoard.pause();
};

NPEngine.CanvasRenderer.prototype.onEngineStop = function() {
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onStop();
  }
};

NPEngine.CanvasRenderer.prototype.onEngineDestroy = function() {
};

NPEngine.CanvasRenderer.prototype.addChild = function (displayObject) {
  if ((displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error();
  }
  displayObject.onAttachedRenderer(this.view.width, this.view.height, this.timeBoard);
  this.children.push(displayObject);

  if (this.grid != null) {
    displayObject.onAttachedGrid(this.grid);
  }
};

NPEngine.CanvasRenderer.prototype.setGrid = function (gridObject) {
  gridObject.onAttachedRenderer(this.view.width, this.view.height);
  for (var i=0, length=this.children.length; i<length; i++) {
    this.children[i].onAttachedGrid(gridObject);
  }
  this.grid = gridObject;
};

NPEngine.CanvasRenderer.prototype.update = function () {
  var length = this.children.length;
  for (var i = 0; i < length; i++) {
    this.children[i].update();
  }

  this.timeBoard.update();
}

NPEngine.CanvasRenderer.prototype.render = function () {
  // clear
  this.context.clearRect(0, 0, this.view.width, this.view.height);

  // render
  var length = this.children.length;
  if (this.grid != null) {
    this.grid.render(this.context);
  }
  for (var i = 0; i < length; i++) {
    this.children[i].render(this.context);
  }

  this.timeBoard.render(this.context);
};

NPEngine.CanvasRenderer.prototype.setFps = function (flag) {

}
NPEngine.TimeBoard = function () {
  this.visible = true;
  this.init();
};

// constructor
NPEngine.TimeBoard.prototype.constructor = NPEngine.TimeBoard;



NPEngine.TimeBoard.prototype.init = function () {
  this.timeFormat = "00:00:00";
  this.sumOfTime = undefined;
};

NPEngine.TimeBoard.prototype.resume = function () {
  if (this.sumOfTime === undefined) {
    this.then = new Date().getTime();
  }
  else {
    this.then = new Date().getTime() - this.sumOfTime;
  }
};

NPEngine.TimeBoard.prototype.pause = function () {
  this.sumOfTime = new Date().getTime() - this.then;
};

NPEngine.TimeBoard.prototype.update = function () {
  var now = new Date().getTime();
  var delta = now - this.then;
  this.timeFormat = NPEngine.Convert.toTimeFormat(delta);
};

NPEngine.TimeBoard.prototype.render = function (context) {
  if (this.visible == false) {
    return ;
  }

  if (this.visible == true) {
    context.font = "20px Arial";
    context.fillText("Time: " + this.timeFormat, 0, 22);
  }
};
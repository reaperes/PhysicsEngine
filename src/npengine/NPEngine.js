NPEngine = function() {
  this.state = 'create';    // create, init, ready, start, resume, pause, stop, destroy
  this.init();
};

NPEngine.prototype.constructor = NPEngine;



NPEngine.prototype.init = function() {
  this.state = 'init';
  this.renderer = new NPEngine.CanvasRenderer;
  this.renderer.onEngineInit();
};

NPEngine.prototype.ready = function() {
  this.state = 'ready';
  this.renderer.onEngineReady();
};

NPEngine.prototype.start = function() {
  this.state = 'start';

  this.renderer.onEngineStart();

  this.resume();
};

NPEngine.prototype.resume = function() {
  this.state = 'resume';
  var that = this;
  this.isRun = true;

  this.renderer.onEngineResume();

  requestAnimationFrame(run);
  function run() {
    if (!that.isRun) {
      return ;
    }
    requestAnimationFrame(run);
    that.renderer.render();
  }
};

NPEngine.prototype.pause = function() {
  this.state = 'pause';
  this.renderer.onEnginePause();
};

NPEngine.prototype.stop = function() {
  this.state = 'stop';
  this.isRun = false;
  this.renderer.onEngineStop();
};

NPEngine.prototype.destroy = function() {
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
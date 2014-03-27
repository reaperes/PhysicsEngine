/**
 @param {HTMLElement} canvas
 @return {NPEngine}
 */
NPEngine = function(canvas) {
  this.fps = new NPEngine.FPS();
  this.state = 'create';    // create, init, ready, start, resume, pause, stop, destroy

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
    that.fps.begin();
    that.renderer.render();
    that.fps.end();
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

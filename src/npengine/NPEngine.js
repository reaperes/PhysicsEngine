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
    requestAnimationFrame(run);
    that.renderer.render();
  }
};

NPEngine.prototype.stop = function() {
  this.isStart = false;

  this.renderer.onEngineStop();
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
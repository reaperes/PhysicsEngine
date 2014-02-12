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
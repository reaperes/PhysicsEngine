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
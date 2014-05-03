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

  // for double buffering
  this.backCanvas = document.createElement('canvas');
  this.backCanvas.width = canvas.width;
  this.backCanvas.height = canvas.height;
  this.backContext = this.backCanvas.getContext('2d');
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
  this.backContext.fillStyle='rgb(0, 0, 0)';
  this.backContext.fillRect(0, 0, this.view.width, this.view.height);
//  this.context.globalCompositeOperation = 'xor';

  // render
  var length = this.children.length;
  if (this.grid != null) {
    this.grid.render(this.backContext);
  }
  for (var i = 0; i < length; i++) {
    this.children[i].render(this.backContext);
  }

  this.timeBoard.render(this.backContext);

  this.context.drawImage(this.backCanvas, 0, 0);
};
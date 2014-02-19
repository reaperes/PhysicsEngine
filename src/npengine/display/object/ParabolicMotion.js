NPEngine.ParabolicMotion = function() {
  NPEngine.DisplayObject.call(this);

};

NPEngine.ParabolicMotion.prototype.constructor = NPEngine.ParabolicMotion;
NPEngine.ParabolicMotion.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.ParabolicMotion.prototype.onAttachedRenderer = function(viewWidth, viewHeight) {
};

NPEngine.ParabolicMotion.prototype.onAttachedGrid = function (gridObject) {
};

NPEngine.ParabolicMotion.prototype.compute = function () {
};

NPEngine.ParabolicMotion.prototype.onReady = function() {
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
};

NPEngine.ParabolicMotion.prototype.render = function (context) {
  context.beginPath();
  context.rect(0, 0, 100, 100);
  context.fillStyle = 'black';
  context.fill();
  context.stroke();
};

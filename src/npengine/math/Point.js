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
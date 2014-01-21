NPEngine.Point = function(positionX, positionY) {
    this.x = positionX || 0;
    this.y = positionY || 0;
};

NPEngine.Point.prototype = Object.create(NPEngine.Point.prototype);
NPEngine.Point.prototype.constructor = NPEngine.Point;

NPEngine.Point.prototype.setX = function(positionX) {
    this.x = positionX || this.x;
}

NPEngine.Point.prototype.setY = function(positionY) {
    this.y = positionY || this.y;
}

NPEngine.Point.prototype.getX = function() {
    return this.x;
}

NPEngine.Point.prototype.getY = function() {
    return this.y;
}
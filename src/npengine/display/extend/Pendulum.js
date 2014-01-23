NPEngine.Pendulum = function() {
    NPEngine.DisplayObject.call(this);

    this.circleMass = 1;
    this.lineLength = 1;
    this.gravity = 9.8;
    this.circleTheta0 = 0.7854;
    this.circlePosition0 = 0.7854;
    this.circumference = this.circlePosition0;
    this.v = 0;
    this.t = 0.01;
    this.ratio = 300;

    this.pivot = new NPEngine.Point(0, 0);
    this.circle = new NPEngine.Point(0, 400);

};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.update = function() {
    this.v = this.v + (-this.gravity * Math.sin(this.circumference/this.lineLength))*this.t;
    this.circumference = this.circumference + this.v * this.t;
    this.circle.x = this.lineLength * Math.sin(this.circumference/this.lineLength);
    this.circle.y = this.lineLength * Math.cos(this.circumference/this.lineLength);
};

NPEngine.Pendulum.prototype.render = function(context) {
    // draw line
    context.beginPath();
    context.moveTo(this.pivot.x, this.pivot.y);
    context.lineTo(this.pivot.x + this.circle.x * this.ratio, this.pivot.y + this.circle.y * this.ratio);
    context.stroke();

    context.beginPath();
    context.arc(this.pivot.x + this.circle.x * this.ratio, this.pivot.y + this.circle.y * this.ratio, 50, 0, 2*Math.PI);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
};

NPEngine.Pendulum.prototype.setPivot = function(x, y) {
    if (x == 'undefined' || y == 'undefined')
        throw new Error(x + 'or ' + y + ' is undefined');

    this.pivot.x = x;
    this.pivot.y = y;
};

/**
 * Set pendulum's ball by relative pivot's coordinates
 *
 * @method setCircle
 * @param x {Number} The X coord of the point to circle from pivot
 * @param y {Number} The Y coord of the point to circle from pivot
 */
NPEngine.Pendulum.prototype.setCircleCoordsFromPivot = function(x, y) {
    if (x == 'undefined' || y == 'undefined')
        throw new Error(x + 'or ' + y + ' is undefined');

    this.circle.x = this.pivot.x + x;
    this.circle.y = this.pivot.y + y;
};

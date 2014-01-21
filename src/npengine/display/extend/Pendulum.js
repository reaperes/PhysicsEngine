NPEngine.Pendulum = function() {
    NPEngine.DisplayObject.call(this);

    this.pivot = new NPEngine.Point(100, 0);
    this.circle = new NPEngine.Point(400, 400);
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.DisplayObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;



NPEngine.Pendulum.prototype.update = function() {

};

NPEngine.Pendulum.prototype.render = function(context) {
    // draw line
    context.beginPath();
    context.moveTo(this.pivot.x, this.pivot.y);
    context.lineTo(this.circle.x, this.circle.y);
    context.stroke();

    context.beginPath();
    context.arc(this.circle.x, this.circle.y, 50, 0, 2*Math.PI);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
};
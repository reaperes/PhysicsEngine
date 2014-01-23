var NPEngine = NPEngine || {};
NPEngine.DisplayObject = function() {
};

// constructor
NPEngine.DisplayObject.prototype.constructor = NPEngine.DisplayObject;

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

NPEngine.CanvasRenderer = function(view) {
    this.DEBUG = true;

    this.children = [];

    this.view = view || document.createElement( "canvas" );
    console.log(this.view.width + " " + this.view.height);
    this.view.width = this.view.width || 800;
    this.view.height = this.view.height || 600;
    this.context = this.view.getContext( "2d" );

    if (this.DEBUG) {
        this.fps = new NPEngine.FPSBoard();
    }
};

// constructor
NPEngine.CanvasRenderer.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.CanvasRenderer.prototype.render = function() {
    // clear

    this.context.clearRect(0, 0, this.view.width, this.view.height);


    // update
    var length = this.children.length;
    for (var i=0; i<length; i++) {
        this.children[i].update();
    }

    if (this.DEBUG) {
        this.fps.update();
    }


    // render
    for (var i=0; i<length; i++) {
        this.children[i].render(this.context);
    }

    if (this.DEBUG) {
        this.fps.render(this.context);
    }
};

NPEngine.CanvasRenderer.prototype.addChild = function(displayObject) {
    if (displayObject instanceof NPEngine.DisplayObject) {
        this.children.push(displayObject);
    }
};
NPEngine.FPSBoard = function() {
    this.then = new Date;
    this.count = 0;
    this.fps = 0;
};

// constructor
NPEngine.FPSBoard.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.FPSBoard.prototype.update = function() {
    this.count++;
};

NPEngine.FPSBoard.prototype.render = function(context) {
    var now = new Date;
    var delta = now - this.then;

    if (this.count%100 == 0) {
        this.fps = Number((1000/delta).toFixed(1));
    }
    context.font="20px Arial";
    context.fillText("fps: " + this.fps, 0, 22);
    this.then = now;
};
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
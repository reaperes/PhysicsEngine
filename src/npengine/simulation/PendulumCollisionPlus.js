NPEngine.PendulumCollisionPlus = function(options) {
  NPEngine.DisplayObject.call(this);

  options = options || {};
  
  // final variables
  this.deltaTime        = 0.00001;     // second

  // exception
  options.num !== undefined && options.num < 3 ? options.num = 3 : options.num;

  // initial variables
  this.num = options.num !== undefined ? options.num : 4;      // number
  this.k = options.k !== undefined ? options.k : 10000000;     // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;         // N s/m

  this.theta = [];
  for (var i=1; i<=this.num; i++) {
    this['theta'+i] = options['theta'+i] !== undefined ? NPEngine.Convert.toRadians(options['theta'+i]) : 0;
  }

  // other variables
  this.gravity          = 9.8;        // m/s^2
  this.mass             = 0.5;        // kg
  this.lineLength       = 1;          // m
  this.diameter         = 0.1;        // m
  this.thetaBias        = 0.002;      // radian
  this.angularVelocity  = [];         // m/s
  this.pivot            = [];         // point
  this.ball = [];
  this.ratio = Math.pow(2, 8);
};

NPEngine.PendulumCollisionPlus.prototype.constructor = NPEngine.PendulumCollisionPlus;
NPEngine.PendulumCollisionPlus.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.PendulumCollisionPlus.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.timeBoard = timeBoard;
};

NPEngine.PendulumCollisionPlus.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.PendulumCollisionPlus.prototype.compute = function () {
  this.memory = [];

  // init values
  this.theta            = [];
  this.angularVelocity  = [];
  this.pivot            = [];
  this.ball             = [];
  for (var i=0, theta=0; i<this.num; i++) {
    if (this.hasOwnProperty('theta'+(i+1)))
      this.theta.push(this['theta'+(i+1)]);
    else
      this.theta.push(0);
    this.angularVelocity.push(0);
    this.pivot.push(new NPEngine.Point);
    this.ball.push(new NPEngine.Point);
  }

  for (var i=0; i<this.num; i++) {
    if (this.hasOwnProperty('theta'+(i+1))) {
      this.theta[i] = this['theta'+(i+1)];
    }
  }

  // compute values
  var centerWidth = this.width/2;
  if (this.num%2 == 0) {
    this.pivot[(this.num/2)-1].x = centerWidth-this.ratio*this.diameter;
    this.pivot[this.num/2].x = centerWidth+this.ratio*this.diameter;
    if (this.num > 2) {
      this.pivot[(this.num/2)-1].x = centerWidth-this.ratio*this.diameter;
      for (var i=0; i<this.num/2-1; i++) {
        this.pivot[(this.num/2)-2-i].x = centerWidth-(this.ratio*this.diameter*2*(i+1))-this.ratio*this.diameter;
      }
      this.pivot[(this.num/2)].x = centerWidth+this.ratio*this.diameter;
      for (var i=0; i<this.num/2-1; i++) {
        this.pivot[(this.num/2)+1+i].x = centerWidth+(this.ratio*this.diameter*2*(i+1))+this.ratio*this.diameter;
      }
    }
  }
  else {
    this.pivot[(this.num-1)/2].x = centerWidth;
    if (this.num >= 3) {
      this.pivot[(this.num-1)/2-1].x = centerWidth-(this.ratio*this.diameter*2);
      this.pivot[(this.num-1)/2+1].x = centerWidth+(this.ratio*this.diameter*2);
    }
    if (this.num >=5) {
      for (i=0; i<(this.num-1)/2-1; i++) {
        this.pivot[(this.num-1)/2-2-i].x = centerWidth-(this.ratio*this.diameter*(2*i+4));
        this.pivot[(this.num-1)/2+2+i].x = centerWidth+(this.ratio*this.diameter*(2*i+4));
      }
    }
  }

  for (i=0; i<this.num; i++) {
    this.pivot[i].y = 0;
  }

  var inertia = this.mass*this.lineLength*this.lineLength;  // moment of inertia
  var theta = this.theta.slice(0);
  var angularVelocity = this.angularVelocity.slice(0);
  var impulsiveForce = [];
  for (i=0; i<this.num-1; i++) {
    impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
  }

  var torque = [];
  torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
  for (i=1; i<this.num-1; i++) {
    torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
  }
  torque[this.num-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.num-1])+this.lineLength*impulsiveForce[this.num-2];

  var data = {};
  for (i=0; i<this.num; i++) {
    data['theta'+(i+1)] = theta[i];
  }
  this.memory.push(data);

  var memoryFlag = 1;
  for (var j=0; j<6000000; j++) {
    for (i=0; i<this.num-1; i++) {
      impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
    }

    torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
    for (i=1; i<this.num-1; i++) {
      torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
    }
    torque[this.num-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.num-1])+this.lineLength*impulsiveForce[this.num-2];

    for (i=0; i<this.num; i++) {
      angularVelocity[i] = angularVelocity[i]+torque[i]/inertia*this.deltaTime;
    }

    for (i=0; i<this.num; i++) {
      theta[i] = theta[i]+angularVelocity[i]*this.deltaTime;
    }

    if (memoryFlag==1000) {
      memoryFlag=1;
      data = {};
      for (i=0; i<this.num; i++) {
        data['theta'+(i+1)] = theta[i];
      }
      this.memory.push(data);
    }
    else {
      memoryFlag++;
    }
  }
};

NPEngine.PendulumCollisionPlus.prototype.onReady = function() {
  for (var i=0; i<this.num; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.theta[i]);
    this.ball[i].y = this.lineLength*Math.cos(this.theta[i]);
  }
};

NPEngine.PendulumCollisionPlus.prototype.onStart = function() {
};

NPEngine.PendulumCollisionPlus.prototype.onResume = function() {
};

NPEngine.PendulumCollisionPlus.prototype.onPause = function() {
};

NPEngine.PendulumCollisionPlus.prototype.onStop = function() {
};

NPEngine.PendulumCollisionPlus.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10);

  for (var i=0; i<this.num; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.memory[gap]['theta'+(i+1)]);
    this.ball[i].y = this.lineLength*Math.cos(this.memory[gap]['theta'+(i+1)]);
  }
};

NPEngine.PendulumCollisionPlus.prototype.render = function (context) {
  var text = 'rgba(0, 0, 0, 0.8)';
  var stroke = 'rgba(255, 255, 255, 0.8)';
  var fill = 'rgba(255, 255, 255, 0.8)';

  context.lineWidth = 2;
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  for (var i=0; i<this.num; i++) {
    context.beginPath();
    context.moveTo(this.pivot[i].x, this.pivot[i].y);
    context.lineTo(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.arc(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y, this.ratio*this.diameter, 0, 2*Math.PI, true);
    context.fill();
    context.closePath();
  }

  // draw pendulum number
  context.beginPath();
  context.font = '34pt Calibri';
  context.fillStyle = text;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (var i=0; i<this.num; i++) {
    context.fillText(String(i+1), this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
  }
  context.stroke();
  context.closePath();
};

NPEngine.PendulumCollisionPlus.prototype.setVariables = function (options) {
  options = options || {};

  // exception
  options.num !== undefined && options.num < 3 ? options.num = 3 : options.num;

  // initial variables
  this.num = options.num !== undefined ? options.num : 4;      // number
  this.k = options.k !== undefined ? options.k : 10000000;     // N/m
  this.mu = options.mu !== undefined ? options.mu : 0;         // N s/m

  this.theta = [];
  for (var i = 1; i <= this.num; i++) {
    this['theta'+i] = options['theta'+i] !== undefined ? NPEngine.Convert.toRadians(options['theta'+i]) : 0;
  }
};
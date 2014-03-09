NPEngine.PendulumCollision3 = function() {
  NPEngine.DisplayObject.call(this);

  // final variables
  this.deltaTime        = 0.0001;     // second

  // initial variables
  this.numOfPendulum    = 3;          // number
  this.gravity          = 9.8;        // m/s^2
  this.mass             = 0.5;        // kg
  this.lineLength       = 1;          // m
  this.k                = 5000000;    // N/m
  this.mu               = 0;          // N s/m

  this.diameter         = 0.1;        // m
  this.theta            = [];         // radian
  this.thetaBias        = 0.002;      // radian
  this.angularVelocity  = [];         // m/s
  this.pivot            = [];         // point
  this.ball = [];
  this['theta'+(this.numOfPendulum)] = NPEngine.Convert.toRadians(45);

  this.ratio = Math.pow(2, 8);
};

NPEngine.PendulumCollision3.prototype.constructor = NPEngine.PendulumCollision3;
NPEngine.PendulumCollision3.prototype = Object.create(NPEngine.DisplayObject.prototype);



NPEngine.PendulumCollision3.prototype.onAttachedRenderer = function(viewWidth, viewHeight, timeBoard) {
  this.width = viewWidth;
  this.height = viewHeight;
  this.timeBoard = timeBoard;
};

NPEngine.PendulumCollision3.prototype.onAttachedGrid = function (gridObject) {
  this.grid = gridObject;
};

NPEngine.PendulumCollision3.prototype.compute = function () {
  this.memory = [];

  // init values
  this.theta            = [];
  this.angularVelocity  = [];
  this.pivot            = [];
  this.ball             = [];
  for (var i=0, theta=0; i<this.numOfPendulum; i++) {
    if (this.hasOwnProperty('theta'+(i+1)))
      this.theta.push(this['theta'+(i+1)]);
    else
      this.theta.push(0);
    this.angularVelocity.push(0);
    this.pivot.push(new NPEngine.Point);
    this.ball.push(new NPEngine.Point);
  }

  for (var i=0; i<this.numOfPendulum; i++) {
    if (this.hasOwnProperty('theta'+(i+1))) {
      this.theta[i] = this['theta'+(i+1)];
    }
  }

  // compute values
  var centerWidth = this.width/2;
  if (this.numOfPendulum%2 == 0) {
    this.pivot[(this.numOfPendulum/2)-1].x = centerWidth-this.ratio*this.diameter;
    this.pivot[this.numOfPendulum/2].x = centerWidth+this.ratio*this.diameter;
    if (this.numOfPendulum > 2) {
      this.pivot[(this.numOfPendulum/2)-1].x = centerWidth-this.ratio*this.diameter;
      for (var i=0; i<this.numOfPendulum/2-1; i++) {
        this.pivot[(this.numOfPendulum/2)-2-i].x = centerWidth-(this.ratio*this.diameter*2*(i+1))-this.ratio*this.diameter;
      }
      this.pivot[(this.numOfPendulum/2)].x = centerWidth+this.ratio*this.diameter;
      for (var i=0; i<this.numOfPendulum/2-1; i++) {
        this.pivot[(this.numOfPendulum/2)+1+i].x = centerWidth+(this.ratio*this.diameter*2*(i+1))+this.ratio*this.diameter;
      }
    }
  }
  else {
    this.pivot[(this.numOfPendulum-1)/2].x = centerWidth;
    if (this.numOfPendulum >= 3) {
      this.pivot[(this.numOfPendulum-1)/2-1].x = centerWidth-(this.ratio*this.diameter*2);
      this.pivot[(this.numOfPendulum-1)/2+1].x = centerWidth+(this.ratio*this.diameter*2);
    }
    if (this.numOfPendulum >=5) {
      for (var i=0; i<(this.numOfPendulum-1)/2-1; i++) {
        this.pivot[(this.numOfPendulum-1)/2-2-i].x = centerWidth-(this.ratio*this.diameter*(2*i+4));
        this.pivot[(this.numOfPendulum-1)/2+2+i].x = centerWidth+(this.ratio*this.diameter*(2*i+4));
      }
    }
  }

  for (var i=0; i<this.numOfPendulum; i++) {
    this.pivot[i].y = 0;
  }

  var inertia = this.mass*this.lineLength*this.lineLength;  // moment of inertia
  var theta = this.theta.slice(0);
  var angularVelocity = this.angularVelocity.slice(0);
  var impulsiveForce = [];
  for (var i=0; i<this.numOfPendulum-1; i++) {
    impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
  }

  var torque = [];
  torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
  for (var i=1; i<this.numOfPendulum-1; i++) {
    torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
  }
  torque[this.numOfPendulum-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.numOfPendulum-1])+this.lineLength*impulsiveForce[this.numOfPendulum-2];

  var data = {};
  for (var i=0; i<this.numOfPendulum; i++) {
    data['theta'+(i+1)] = theta[i];
  }
  this.memory.push(data);

  var memoryFlag = 1;
  for (var j=0; j<200000; j++) {
    for (var i=0; i<this.numOfPendulum-1; i++) {
      impulsiveForce[i] = ((theta[i+1]-theta[i]) < -this.thetaBias) ? -this.k*(theta[i+1]-theta[i]+this.thetaBias)*this.lineLength-this.mu*this.lineLength*(angularVelocity[i+1]-angularVelocity[i]) : 0;
    }

    torque[0] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[0])-this.lineLength*impulsiveForce[0];
    for (var i=1; i<this.numOfPendulum-1; i++) {
      torque[i] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[i])-this.lineLength*(impulsiveForce[i]-impulsiveForce[i-1]);
    }
    torque[this.numOfPendulum-1] = -this.mass*this.gravity*this.lineLength*Math.sin(theta[this.numOfPendulum-1])+this.lineLength*impulsiveForce[this.numOfPendulum-2];

    for (var i=0; i<this.numOfPendulum; i++) {
      angularVelocity[i] = angularVelocity[i]+torque[i]/inertia*this.deltaTime;
    }

    for (var i=0; i<this.numOfPendulum; i++) {
      theta[i] = theta[i]+angularVelocity[i]*this.deltaTime;
    }

    if (memoryFlag==100) {
      memoryFlag=1;
      var data = {};
      for (var i=0; i<this.numOfPendulum; i++) {
        data['theta'+(i+1)] = theta[i];
      }
      this.memory.push(data);
    }
    else {
      memoryFlag++;
    }
  }
};

NPEngine.PendulumCollision3.prototype.onReady = function() {
  for (var i=0; i<this.numOfPendulum; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.theta[i]);
    this.ball[i].y = this.lineLength*Math.cos(this.theta[i]);
  }
};

NPEngine.PendulumCollision3.prototype.onStart = function() {
};

NPEngine.PendulumCollision3.prototype.onResume = function() {
};

NPEngine.PendulumCollision3.prototype.onPause = function() {
};

NPEngine.PendulumCollision3.prototype.onStop = function() {
};

NPEngine.PendulumCollision3.prototype.update = function () {
  var gap = Math.round((new Date().getTime()-this.timeBoard.then)/10);

  for (var i=0; i<this.numOfPendulum; i++) {
    this.ball[i].x = this.lineLength*Math.sin(this.memory[gap]['theta'+(i+1)]);
    this.ball[i].y = this.lineLength*Math.cos(this.memory[gap]['theta'+(i+1)]);
  }
};

NPEngine.PendulumCollision3.prototype.render = function (context) {
  for (var i=0; i<this.numOfPendulum; i++) {
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(this.pivot[i].x, this.pivot[i].y);
    context.lineTo(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
    context.stroke();

    context.beginPath();
    context.arc(this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y, this.ratio*this.diameter, 0, 2*Math.PI, true);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
  }

  // draw pendulum number
  context.beginPath();
  context.font = '34pt Calibri';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (var i=0; i<this.numOfPendulum; i++) {
    context.fillText(String(i+1), this.pivot[i].x+this.ratio*this.ball[i].x, this.pivot[i].y+this.ratio*this.ball[i].y);
  }
  context.stroke();
};

NPEngine.PendulumCollision3.prototype.setNumOfPendulum = function (value) {
  this.numOfPendulum = value;
};

NPEngine.PendulumCollision3.prototype.setGravity = function (value) {
  this.gravity = value;
};

NPEngine.PendulumCollision3.prototype.setK = function (value) {
  this.k = value;
};

NPEngine.PendulumCollision3.prototype.setMu = function (value) {
  this.mu = value;
};

NPEngine.PendulumCollision3.prototype.setAngleByIndex = function (value, index) {
  alert('hello');
  for (var i=0; i<this.numOfPendulum; i++) {
    this['theta'+(i+1)] = 0;
  }
  this['theta'+(index+1)] = NPEngine.Convert.toRadians(value);
};
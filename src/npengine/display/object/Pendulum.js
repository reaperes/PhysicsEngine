/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Pendulum object
 *
 * @class Pendulum
 * @constructor
 */
NPEngine.Pendulum = function() {
  var pivot = new NPEngine.Point();
  var line = new NPEngine.Line();
  var ball = new NPEngine.Circle();

  this.getPivot = function() {
    return pivot;
  };

  this.setPivot = function(val) {
    if (val.x) {
      pivot.x = x || pivot.x;
      line.x1 = pivot.x;
    }
    if (val.y) {
      pivot.y = y || pivot.y;
      line.y1 = pivot.y;
    }
  };

  this.getBall = function() {
    return ball;
  };

  this.setBall = function(val) {
    if (val.x) {
      ball.x = val.x;
      line.x2 = val.x;
    }
    if (val.y) {
      ball.y = val.y;
      line.y2 = val.y;
    }
    if (val.radius) {
      ball.radius = val.radius;
    }
  };
};

//NPEngine.Pendulum.prototype = {
//  constructor: NPEngine.Pendulum
//};
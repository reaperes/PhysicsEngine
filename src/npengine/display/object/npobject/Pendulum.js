/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * Pendulum NPObject
 *
 * @class NPEngine.Pendulum
 * @extends NPObject
 * @constructor
 */
NPEngine.Pendulum = function() {
  NPEngine.NPObject.call( this );

  this.type = NPEngine.NPObject.PENDULUM;
  this.interactive = true;

  var pivot = new NPEngine.Point();
  var line = new NPEngine.Line();
  var circle = new NPEngine.Circle();

  this.getPivot = function() {
    return pivot;
  };

  this.setPivot = function(val) {
    if (val.x) {
      pivot.x = val.x || pivot.x;
      line.x1 = pivot.x;
    }
    if (val.y) {
      pivot.y = val.y || pivot.y;
      line.y1 = pivot.y;
    }
  };

  this.getCircle = function() {
    return circle;
  };

  this.setCircle = function(val) {
    if (val.x) {
      circle.x = val.x;
      line.x2 = val.x;
    }
    if (val.y) {
      circle.y = val.y;
      line.y2 = val.y;
    }
    if (val.radius) {
      circle.radius = val.radius;
    }
  };

  this.getLine = function() {
    return line;
  };

  this.update = function() {
//    console.log('update object');
  };

  this.isObjectEvent = function(event) {
    return event.npX * event.npX + event.npY * event.npY < circle.radius * circle.radius;
  };

  this.onMouseDown = function(event) {
    console.log('onMouseDown');
  };
};

NPEngine.Pendulum.prototype = Object.create(NPEngine.NPObject.prototype);
NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Pendulum
 * @constructor
 */
NP.Pendulum = function(circle, pivot) {
  NP.ObjectContainer.call(this);
  this.superObject = NP.Object.prototype;

  this.circle = circle !== undefined ? circle : new NP.Circle();
  this.pivot = pivot !== undefined ? pivot : new THREE.Vector3();
  this.line = new NP.Line(this.circle.position, this.pivot);
  this.position = this.circle.position;

  this.childs.push(this.line);
  this.childs.push(this.circle);

  this.add({
    force: {
      tension: {pivot: this.pivot, object: this.circle}
    }
  });

  /**
   * Set pendulum's configuration.
   *
   * @method set
   * @param options
   */
  this.set = function(options) {
    options = options || {};
  }
};

NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype);
NP.Pendulum.prototype.constructor = NP.Pendulum;


NP.Pendulum.prototype.update = function(deltaT) {

  this.velocity.x += this.force.x * deltaT;
  this.velocity.y += this.force.y * deltaT;
  this.velocity.z += this.force.z * deltaT;

  var distance = this.velocity.clone().multiplyScalar(deltaT);
  this.circle.position.add(distance);
};

NP.Pendulum.prototype.add = function() {
  this.superObject.add.call(this, arguments[0]);

  var i, len=this.childs.length;

  for (i=0; i<len; i++) {
    this.childs[i].add.call(this.childs[i], arguments[0]);
  }
};
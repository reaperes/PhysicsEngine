/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.ElasticForce
 * @constructor
 */
NP.ElasticForce = function(gravity) {
  NP.Force.call(this);

};

NP.ElasticForce.prototype = Object.create(NP.Force.prototype);
NP.ElasticForce.prototype.constructor = NP.ElasticForce;

NP.ElasticForce.prototype.update = function() {
  return this.vector;
};

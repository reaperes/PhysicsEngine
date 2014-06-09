/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Engine
 * @constructor
 */
NP.Engine = function() {
  this.add = function(arg) {
    alert('add object');
  }
};

NP.Engine.prototype.constructor = NP.Engine;

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * NP.ObjectContainer can contains every NP.Object
 *
 * @class NP.ObjectContainer
 * @constructor
 */
NP.ObjectContainer = function() {
  NP.Object.call(this);
};

NP.ObjectContainer.prototype = Object.create(NP.Object.prototype);
NP.ObjectContainer.prototype.constructor = NP.ObjectContainer;

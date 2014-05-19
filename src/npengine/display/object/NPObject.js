/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NPObject
 * @constructor
 */
NPEngine.NPObject = function() {
  /**
   * Whether or not the object is interactive
   * @property interactive
   * @type Boolean
   */
  this.interactive = false;

  /**
   * Pendulum. Type of npobject list.
   * @static
   * @property type
   */
  this.PENDULUM = 1;
};

NPEngine.NPObject.prototype = {
  constructor: NPEngine.NPObject,

  /**
   * Check event is belong to target NPObject.
   * @param event {MouseEvent} event object has npX, npY properties
   */
  isObjectEvent: function(event) {
    throw new Error('Interactive npobject must override isObjectEvent method');
  },

  /**
   * callback method for mouse down event
   * @param event {MouseEvent} event object has npX, npY properties
   */
  onMouseDown: function(event) {
    throw new Error('Interactive npobject must override onMouseDown method.');
  }
};

/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * The NPObject manager deals with NPObjects.
 *
 * @class NPEngine.ObjectManager
 * @constructor
 */
NPEngine.ObjectManager = function() {
  /**
   * NPObjects data
   * @param npobject {Array.<NPEngine.NPObject>}
   */
  var npobjects = [];

  /**
   * push the NPObject
   * @method addObject
   * @param npobject {NPObject}
   */
  this.addObject = function(npobject) {
    npobjects.push(npobject);
  };

  /**
   * return NPObjects
   *
   * @method addObject
   * @return {Array.<NPEngine.NPObject>} npobjects
   */
  this.getObjects = function() {
    return npobjects;
  };

  /**
   * update npobjects
   * @method updateObjects
   */
  this.updateObjects = function() {
    for (var i= 0, len=npobjects.length; i<len; i++) {
      npobjects[i].update();
    }
  };
};
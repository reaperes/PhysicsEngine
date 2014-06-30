/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NP.Vec3
 * @constructor
 */
NP.Vec3 = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

  /**
   * Convert to Array list
   *
   * @method list
   */
  this.list = function() {
    return [this.x, this.y, this.z];
  };

  /**
   * add
   *
   * @method add
   * @param vec3 {NP.Vec3}
   */
  this.add = function(vec3) {
    this.x += vec3.x;
    this.y += vec3.y;
    this.z += vec3.z;
  };
};

NP.Vec3.prototype.constructor = NP.Vec3;

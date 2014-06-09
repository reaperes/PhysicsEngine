NP = {}, NextPhysics = function(a) {
    var b = new NP.Engine();
    if (void 0 === a || !(a instanceof HTMLCanvasElement)) throw "HTMLCanvasElement parameter is empty or wrong.";
    this.add = function(a) {
        var c = 0, d = a && a.length || 0, e = d ? a[0] : a;
        if (e) do b.add(e); while (++c < d && (e = a[c]));
    };
}, NextPhysics.prototype.constructor = NextPhysics, NP.Engine = function() {
    this.add = function() {
        alert("add object");
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Object = function() {
    this.x = 0, this.y = 0, this.radius = 1;
}, NP.Object.prototype = {
    constructor: NP.Object
};
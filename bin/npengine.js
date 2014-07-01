if (NP = {}, NP.DEBUG = !0, NP.DEBUG) {
    NP.DEBUG_KEY = "debug_key", NP.DEBUG_VALUE = "debug_value";
    var _debug_container = document.createElement("div");
    _debug_container.id = "debug", _debug_container.style.cssText = "width:0px;height:0px;opacity:0.9;";
    var _debug_addKey = function(a, b) {
        var c = document.createElement("span");
        c.id = "debug_key", c.style.cssText = "width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:50px;left:0px;position:absolute;padding-left:10px;", 
        c.textContent = a, _debug_container.appendChild(c);
        var d = document.createElement("span");
        d.id = "debug_key", d.style.cssText = "width:200px;height:100px;background-color:#fff;color:#000;font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:20px;top:70px;left:0px;position:absolute;padding-left:10px;", 
        d.textContent = b, _debug_container.appendChild(d);
    };
    window.onload = function() {
        document.body.appendChild(_debug_container);
    };
}

NP.Util = function() {
    this.isInt = function(a) {
        return "number" == typeof a && a % 1 === 0;
    };
}, NP.Vec3 = function(a, b, c) {
    this.x = a || 0, this.y = b || 0, this.z = c || 0, this.list = function() {
        return [ this.x, this.y, this.z ];
    }, this.add = function(a) {
        return this.x += a.x, this.y += a.y, this.z += a.z, this;
    }, this.divideScala = function(a) {
        if (0 !== a) {
            var b = 1 / a;
            this.x *= b, this.y *= b, this.z *= b;
        } else this.x = 0, this.y = 0, this.z = 0;
        return this;
    }, this.dot = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    };
}, NP.Vec3.prototype.constructor = NP.Vec3, NextPhysics = function(a) {
    var b = new NP.Engine(), c = new NP.Renderer(a), d = .001;
    this.add = function(a) {
        b.add(a), c.add(a);
    }, this.update = function() {
        b.update(d);
    }, this.render = function() {
        c.render();
    }, this.start = function() {
        var a = function() {
            this.update(), this.render(), requestAnimationFrame(a, c.canvas);
        }.bind(this), b = function() {
            d.begin(), this.update(), this.render(), d.end(), requestAnimationFrame(b, c.canvas);
        }.bind(this);
        if (NP.DEBUG) {
            var d = new Stats();
            d.setMode(0), d.domElement.style.position = "absolute", d.domElement.style.left = "0px", 
            d.domElement.style.top = "0px", document.body.appendChild(d.domElement), requestAnimationFrame(b, c.canvas);
        } else requestAnimationFrame(a, c.canvas);
    }, a.addEventListener("mouseover", function() {}.bind(this), !1), a.addEventListener("mousewheel", function(a) {
        a.wheelDelta > 0 ? c.camera.position.z -= c.camera.position.z / 10 : c.camera.position.z += c.camera.position.z / 10;
    }.bind(this), !1);
}, NextPhysics.prototype.constructor = NextPhysics, NP.Engine = function() {
    var a = [];
    this.add = function(b) {
        a.push(b);
    }, this.update = function(c) {
        var d, e;
        for (d = 0, e = a.length; e > d; d++) {
            var f = a[d], g = f.force = b(f.forces), h = f.velocity;
            h.x += g.x * c, h.y += g.y * c, h.z += g.z * c;
            var i = f.position;
            i.x += h.x * c, i.y += h.y * c, i.z += h.z * c;
        }
    };
    var b = function(a) {
        var b = Object.keys(a), c = b.length;
        if (0 == c) return new NP.Vec3();
        var d, e = new NP.Vec3();
        for (d = 0; c > d; d++) {
            var f = a[NP.Force.Type.GRAVITY];
            f.update(), e.add(f.vector);
        }
        return e;
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function() {
    this.position = new NP.Vec3(), this.vector = new NP.Vec3();
}, NP.Force.prototype.constructor = NP.Force, NP.Force.Type = {
    GRAVITY: "gravity",
    TENSION: "tension"
}, NP.Force.prototype.list = function() {
    return this.vector.list();
}, NP.Force.prototype.update = function() {
    throw new Error("Update function must be override.");
}, NP.GravityForce = function(a) {
    NP.Force.call(this), a = a || 9.8, this.__defineGetter__("gravity", function() {
        return a;
    }), this.__defineSetter__("gravity", function(b) {
        a = b, this.vector.y = -b;
    }), this.vector.x = 0, this.vector.y = -a, this.vector.z = 0;
}, NP.GravityForce.prototype = Object.create(NP.Force.prototype), NP.GravityForce.prototype.constructor = NP.GravityForce, 
NP.GravityForce.prototype.update = function() {}, NP.TensionForce = function(a, b) {
    NP.Force.call(this), this.pivot = void 0 !== a ? a : new NP.Vec3(), this.reactionForce = void 0 !== b ? b : new NP.Vec3();
}, NP.GravityForce.prototype = Object.create(NP.Force.prototype), NP.GravityForce.prototype.constructor = NP.GravityForce, 
NP.GravityForce.prototype.update = function() {}, NP.Object = function() {
    this.type = void 0, this.forces = {}, this.force = new NP.Vec3(), this.velocity = new NP.Vec3(), 
    this.position = new NP.Vec3();
}, NP.Object.prototype.constructor = NP.Object, NP.Object.prototype.add = function() {
    var a = function(a) {
        var b, c, d = Object.keys(a);
        for (b = 0, c = d.length; c > b; b++) "gravity" === d[b] && (this.forces.gravity = new NP.GravityForce(a[d[b]]), 
        this.forces.gravity.position = this.position);
    };
    return function() {
        var b, c, d;
        for (b = 0, c = arguments.length; c > b; b++) for (d in arguments[b]) "force" === d && a.call(this, arguments[b].force);
    };
}(), NP.Object.Type = {
    LINE: "line",
    CIRCLE: "circle",
    SPHERE: "sphere"
}, NP.ObjectContainer = function() {
    NP.Object.call(this);
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Circle = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.CIRCLE, this.position.x = void 0 !== a ? a : this.position.x, 
    this.position.y = void 0 !== b ? b : this.position.y, this.position.z = void 0 !== c ? c : this.position.z, 
    this.radius = void 0 !== d ? d : this.radius;
}, NP.Circle.prototype = Object.create(NP.Object.prototype), NP.Circle.prototype.constructor = NP.Circle, 
NP.Line = function(a, b) {
    NP.Object.call(this), this.type = NP.Object.Type.LINE, this.v1 = void 0 !== a ? a : new NP.Vec3(), 
    this.v2 = void 0 !== b ? b : new NP.Vec3(), this.position = this.v1;
}, NP.Line.prototype = Object.create(NP.Object.prototype), NP.Line.prototype.constructor = NP.Line, 
NP.Sphere = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.SPHERE, this.position.x = void 0 !== a ? a : this.position.x, 
    this.position.y = void 0 !== b ? b : this.position.y, this.position.z = void 0 !== c ? c : this.position.z, 
    this.radius = void 0 !== d ? d : this.radius;
}, NP.Sphere.prototype = Object.create(NP.Object.prototype), NP.Sphere.prototype.constructor = NP.Sphere, 
NP.Pendulum = function() {
    NP.ObjectContainer.call(this);
}, NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype), NP.Pendulum.prototype.constructor = NP.Pendulum, 
NP.ColorSets = function() {
    var a = {
        background: 16777215,
        color1: 14633289,
        color2: 14842431,
        color3: 15714636,
        color4: 4567709,
        color5: 3362140
    };
    return [ a ];
}(), NP.Renderer = function(a) {
    var b = new THREE.WebGLRenderer(), c = new THREE.Scene(), d = new THREE.PerspectiveCamera(45, a.offsetWidth / a.offsetHeight, 1e-4, 1e5), e = NP.ColorSets[0], f = [];
    b.setClearColor(new THREE.Color(15658734)), b.setSize(a.offsetWidth, a.offsetHeight), 
    a.appendChild(b.domElement), c.add(d), d.position.x = 0, d.position.y = 0, d.position.z = 15, 
    d.lookAt(c.position), this.camera = d, this.canvas = b.domElement, this.render = function() {
        g(), b.render(c, d);
    }, this.add = function(a) {
        var b, d, g = 16;
        switch (a.type) {
          case NP.Object.Type.LINE:
            d = new THREE.LineBasicMaterial({
                color: e.color1
            }), b = new THREE.Geometry(), b.vertices.push(new THREE.Vector3(a.v1.x, a.v1.y, a.v1.z)), 
            b.vertices.push(new THREE.Vector3(a.v2.x, a.v2.y, a.v2.z));
            var h = new THREE.Line(b, d);
            c.add(h);
            break;

          case NP.Object.Type.CIRCLE:
            b = new THREE.CircleGeometry(a.radius, g), d = new THREE.MeshBasicMaterial({
                color: e.color1
            });
            var i = new THREE.Mesh(b, d);
            i.position.x = a.position.x, i.position.y = a.position.y, i.position.z = a.position.z, 
            c.add(i), f.push([ a, i.position ]);
            break;

          case NP.Object.Type.SPHERE:
            b = new THREE.SphereGeometry(a.radius, g, g), d = new THREE.MeshBasicMaterial({
                color: e.color1,
                wireframe: !0
            });
            var j = new THREE.Mesh(b, d);
            j.position.x = a.position.x, j.position.y = a.position.y, j.position.z = a.position.z, 
            c.add(j), f.push([ a, j.position ]);
        }
    };
    var g = function() {
        var a, b;
        for (a = 0, b = f.length; b > a; a++) {
            var c = f[a], d = c[0], e = c[1];
            e.x = d.position.x, e.y = d.position.y, e.z = d.position.z, console.log(e.x + ", " + e.y + ", " + e.z);
        }
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;
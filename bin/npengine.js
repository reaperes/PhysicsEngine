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
        this.x += a.x, this.y += a.y, this.z += a.z;
    };
}, NP.Vec3.prototype.constructor = NP.Vec3, NextPhysics = function(a) {
    var b = new NP.Engine(), c = new NP.Renderer(a), d = .01;
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
        for (d = 0; c > d; d++) switch (b[d]) {
          case NP.Force.GRAVITY:
            e.add(a[NP.Force.GRAVITY].vector);
        }
        return e;
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function() {
    this.vector = new NP.Vec3();
}, NP.Force.prototype.constructor = NP.Force, NP.Force.GRAVITY = "gravity", NP.Force.prototype.list = function() {
    return this.vector.list();
}, NP.GravityForce = function(a) {
    NP.Force.call(this), a = a || 9.8, this.__defineGetter__("gravity", function() {
        return a;
    }), this.__defineSetter__("gravity", function(b) {
        a = b, this.vector.y = -b;
    }), this.vector.x = 0, this.vector.y = -9.8, this.vector.z = 0;
}, NP.GravityForce.prototype = Object.create(NP.Force.prototype), NP.GravityForce.prototype.constructor = NP.GravityForce, 
NP.Object = function() {
    this.type = void 0, this.forces = {}, this.force = new NP.Vec3(), this.velocity = new NP.Vec3(), 
    this.position = new NP.Vec3();
}, NP.Object.prototype.constructor = NP.Object, NP.Object.prototype.add = function() {
    var a = function(a) {
        var b, c, d = Object.keys(a);
        for (b = 0, c = d.length; c > b; b++) "gravity" === d[b] && (this.forces.gravity = "default" === a[b] ? new NP.GravityForce() : new NP.GravityForce(a[b]));
    };
    return function() {
        var b, c, d;
        for (b = 0, c = arguments.length; c > b; b++) for (d in arguments[b]) "force" === d && a.call(this, arguments[b].force);
    };
}(), NP.Object.Type = {
    CIRCLE: "circle",
    SPHERE: "sphere"
}, NP.ObjectContainer = function() {
    NP.Object.call(this);
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Point = function(a, b, c) {
    this.x = a || 0, this.y = b || 0, this.z = c || 0, this.list = function() {
        return [ this.x, this.y, this.z ];
    };
}, NP.Point.prototype.constructor = NP.Point, NP.Circle = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.CIRCLE, this.position.x = void 0 !== a ? a : this.position.x, 
    this.position.y = void 0 !== b ? b : this.position.y, this.position.z = void 0 !== c ? c : this.position.z, 
    this.radius = void 0 !== d ? d : this.radius;
}, NP.Circle.prototype = Object.create(NP.Object.prototype), NP.Circle.prototype.constructor = NP.Circle, 
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
    a.appendChild(b.domElement), c.add(d), d.position.x = 0, d.position.y = 0, d.position.z = 5, 
    d.lookAt(c.position);
    var g = new THREE.AxisHelper(100);
    c.add(g), this.camera = d, this.canvas = b.domElement, this.render = function() {
        h(), b.render(c, d);
    }, this.add = function(a) {
        var b = 16;
        switch (a.type) {
          case NP.Object.Type.CIRCLE:
            var d = new THREE.CircleGeometry(a.radius, b), g = new THREE.MeshBasicMaterial({
                color: e.color1
            }), h = new THREE.Mesh(d, g);
            h.position.x = a.position.x, h.position.y = a.position.y, h.position.z = a.position.z, 
            c.add(h), f.push([ a, h.position ]);
            break;

          case NP.Object.Type.SPHERE:
            var i = new THREE.SphereGeometry(a.radius, b, b), j = new THREE.MeshBasicMaterial({
                color: e.color1,
                wireframe: !0
            }), k = new THREE.Mesh(i, j);
            k.position.x = a.position.x, k.position.y = a.position.y, k.position.z = a.position.z, 
            c.add(k), f.push([ a, k.position ]);
        }
    };
    var h = function() {
        var a, b;
        for (a = 0, b = f.length; b > a; a++) {
            var c = f[a], d = c[0], e = c[1];
            e.x = d.position.x, e.y = d.position.y, e.z = d.position.z, console.log(e.x + ", " + e.y + ", " + e.z);
        }
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;
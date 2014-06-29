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

NextPhysics = function(a) {
    var b = new NP.Engine(), c = new NP.Renderer(a), d = .1;
    this.setDimension = function(a) {
        NP.dimension = "2d" === a || "3d" === a ? a : "2d";
    }, this.add = function(a) {
        b.add(a), c.add(a);
    }, this.update = function() {
        b.update(d);
    }, this.render = function() {
        c.render();
    }, this.start = function() {
        var a = function() {
            this.update(), this.render(), requestAnimationFrame(a, void 0);
        }.bind(this), b = function() {
            c.begin(), this.update(), this.render(), c.end(), requestAnimationFrame(b, void 0);
        }.bind(this);
        if (NP.DEBUG) {
            var c = new Stats();
            c.setMode(0), c.domElement.style.position = "absolute", c.domElement.style.left = "0px", 
            c.domElement.style.top = "0px", document.body.appendChild(c.domElement), requestAnimationFrame(b, void 0);
        } else requestAnimationFrame(a, void 0);
    }, a.addEventListener("mouseover", function() {}.bind(this), !1), a.addEventListener("mousewheel", function(a) {
        a.wheelDelta > 0 ? c.camera.position.z -= c.camera.position.z / 10 : c.camera.position.z += c.camera.position.z / 10, 
        console.log(c.camera.position.z);
    }.bind(this), !1);
}, NextPhysics.prototype.constructor = NextPhysics, NP.Engine = function() {
    var a = [];
    this.add = function(b) {
        a.push(b);
    }, this.update = function(c) {
        var d, e, f, g;
        for (d = 0, f = a.length; f > d; d++) {
            var h = a[d];
            for (h.force = b(h.forces), e = 0, g = h.force.length; g > e; e++) h.velocity[e] += h.force[e] * c;
            for (e = 0, g = h.velocity.length; g > e; e++) h.position[e] += h.velocity[e] * c;
        }
    };
    var b = function(a) {
        var b = Object.keys(a), c = b.length;
        if (0 == c) return [ 0, 0 ];
        var d, e = 0, f = 0;
        for (d = 0; c > d; d++) switch (b[d]) {
          case NP.Force.GRAVITY:
            f -= -9.8;
        }
        return [ e, f ];
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function() {
    this.x = 0, this.y = 0;
}, NP.Force.prototype.constructor = NP.Force, NP.Force.GRAVITY = "gravity", NP.Force.prototype.list = function() {
    this.list = function() {
        return [ this.x, this.y ];
    };
}, NP.GravityForce = function(a) {
    NP.Force.call(this), a = a || 9.8, this.__defineGetter__("gravity", function() {
        return a;
    }), this.__defineSetter__("gravity", function(b) {
        a = b, this.y = -b;
    }), this.x = 0, this.y = -9.8;
}, NP.GravityForce.prototype = Object.create(NP.Force.prototype), NP.GravityForce.prototype.constructor = NP.GravityForce, 
NP.Object = function() {
    this.type = void 0, this.forces = {}, this.force = [ 0, 0 ], this.velocity = [ 0, 0 ], 
    this.position = [ 0, 0 ];
}, NP.Object.prototype.constructor = NP.Object, NP.Object.prototype.add = function() {
    var a = function(a) {
        var b, c;
        for (b = 0, c = Object.keys(a).length; c > b; b++) "gravity" === a[b] && (this.forces.gravity = "default" === a[b] ? new NP.GravityForce() : new NP.GravityForce(a[b]));
    };
    return function() {
        var b, c, d;
        for (b = 0, c = arguments.length; c > b; b++) for (d in arguments[b]) "force" === d && a(arguments[b].force);
    };
}(), NP.Object.Type = {
    CIRCLE: "circle",
    SPHERE: "sphere"
}, NP.ObjectContainer = function() {
    NP.Object.call(this);
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Point = function(a, b) {
    this.x = a || 0, this.y = b || 0, this.list = function() {
        return [ this.x, this.y ];
    };
}, NP.Point.prototype.constructor = NP.Point, NP.Circle = function(a, b, c) {
    NP.Object.call(this), this.type = NP.Object.Type.CIRCLE, this.x = void 0 !== a ? a : this.x, 
    this.y = void 0 !== b ? b : this.y, this.radius = void 0 !== c ? c : this.radius;
}, NP.Circle.prototype = Object.create(NP.Object.prototype), NP.Circle.prototype.constructor = NP.Circle, 
NP.Sphere = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.SPHERE, this.x = void 0 !== a ? a : this.x, 
    this.y = void 0 !== b ? b : this.y, this.z = void 0 !== c ? c : this.z, this.radius = void 0 !== d ? d : this.radius;
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
    var b = new THREE.WebGLRenderer(), c = new THREE.Scene(), d = new THREE.PerspectiveCamera(45, a.offsetWidth / a.offsetHeight, 1e-4, 1e5), e = NP.ColorSets[0];
    b.setClearColor(new THREE.Color(15658734)), b.setSize(a.offsetWidth, a.offsetHeight), 
    a.appendChild(b.domElement), c.add(d), d.position.x = 0, d.position.y = 0, d.position.z = 5, 
    d.lookAt(c.position);
    var f = new THREE.AxisHelper(100);
    c.add(f), this.camera = d, this.render = function() {
        b.render(c, d);
    }, this.add = function(a) {
        var b = 16;
        switch (a.type) {
          case NP.Object.Type.CIRCLE:
            var d = new THREE.CircleGeometry(a.radius, b), f = new THREE.MeshBasicMaterial({
                color: e.color1
            }), g = new THREE.Mesh(d, f);
            g.position.x = a.x, g.position.y = a.y, c.add(g);
            break;

          case NP.Object.Type.SPHERE:
            var h = new THREE.SphereGeometry(a.radius, b, b), i = new THREE.MeshBasicMaterial({
                color: e.color1,
                wireframe: !0
            }), j = new THREE.Mesh(h, i);
            j.position.x = a.x, j.position.y = a.y, j.position.z = a.z, c.add(j);
        }
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;
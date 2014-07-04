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
    return new THREE.Vector3(a, b, c);
}, NextPhysics = function(a) {
    var b = new NP.Engine(), c = new NP.Renderer(a), d = .01;
    this.add = function(a) {
        a instanceof NP.ObjectContainer ? (b.addContainer(a), c.addContainer(a)) : (b.add(a), 
        c.add(a));
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
    }, this.addContainer = function(a) {
        var b, c, d = a.childs;
        for (b = 0, c = d.length; c > b; b++) this.add(d[b]);
    }, this.update = function(c) {
        var d, e;
        for (d = 0, e = a.length; e > d; d++) {
            var f = a[d];
            f.forceFlag && (b(f), f.update(c));
        }
    };
    var b = function(a) {
        var b = a.forces, c = Object.keys(b), d = c.length;
        if (0 == d) return new THREE.Vector3();
        var e = new THREE.Vector3();
        void 0 != b[NP.Force.Type.GRAVITY] && (b[NP.Force.Type.GRAVITY].update(), e.add(b[NP.Force.Type.GRAVITY].vector)), 
        a.force = e, void 0 != b[NP.Force.Type.TENSION] && (b[NP.Force.Type.TENSION].update(), 
        e.add(b[NP.Force.Type.TENSION].vector)), a.force = e;
    };
}, NP.Engine.prototype.constructor = NP.Engine, NP.Force = function() {
    this.position = new THREE.Vector3(), this.vector = new THREE.Vector3();
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
NP.GravityForce.prototype.update = function() {
    return this.vector;
}, NP.TensionForce = function(a, b) {
    NP.Force.call(this), this.pivot = void 0 !== a ? a : new THREE.Vector3(), this.object = void 0 !== b ? b : new NP.Object();
}, NP.TensionForce.prototype = Object.create(NP.Force.prototype), NP.TensionForce.prototype.constructor = NP.TensionForce, 
NP.TensionForce.prototype.update = function() {
    var a = this.pivot.distanceTo(this.object.position), b = Math.abs(this.object.position.y - this.pivot.y) / a;
    this.vector = this.object.force.clone().multiplyScalar(-b);
}, NP.Object = function() {
    this.type = void 0, this.forceFlag = !0, this.forces = {}, this.force = new THREE.Vector3(), 
    this.velocity = new THREE.Vector3(), this.position = new THREE.Vector3();
}, NP.Object.prototype.constructor = NP.Object, NP.Object.Type = {
    LINE: "line",
    CIRCLE: "circle",
    SPHERE: "sphere"
}, NP.Object.prototype.add = function() {
    var a = function(a) {
        var b, c, d = Object.keys(a);
        for (b = 0, c = d.length; c > b; b++) "gravity" === d[b] ? (this.forces.gravity = new NP.GravityForce(a[d[b]]), 
        this.forces.gravity.position = this.position) : "tension" === d[b] && (this.forces.tension = new NP.TensionForce(a[d[b]].pivot, a[d[b]].object));
    };
    return function() {
        var b, c, d;
        for (b = 0, c = arguments.length; c > b; b++) for (d in arguments[b]) "force" === d && a.call(this, arguments[b].force);
    };
}(), NP.Object.prototype.update = function(a) {
    this.velocity.x += this.force.x * a, this.velocity.y += this.force.y * a, this.velocity.z += this.force.z * a, 
    this.position.x += this.velocity.x * a, this.position.y += this.velocity.y * a, 
    this.position.z += this.velocity.z * a;
}, NP.ObjectContainer = function() {
    NP.Object.call(this), this.childs = [];
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Circle = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.CIRCLE, this.position.x = void 0 !== a ? a : this.position.x, 
    this.position.y = void 0 !== b ? b : this.position.y, this.position.z = void 0 !== c ? c : this.position.z, 
    this.radius = void 0 !== d ? d : 1;
}, NP.Circle.prototype = Object.create(NP.Object.prototype), NP.Circle.prototype.constructor = NP.Circle, 
NP.Line = function(a, b) {
    NP.Object.call(this), this.type = NP.Object.Type.LINE, this.forceFlag = !1, this.position = void 0 !== a ? a : new THREE.Vector3(), 
    this.v2 = void 0 !== b ? b : new THREE.Vector3();
}, NP.Line.prototype = Object.create(NP.Object.prototype), NP.Line.prototype.constructor = NP.Line, 
NP.Line.prototype.update = function() {}, NP.Sphere = function(a, b, c, d) {
    NP.Object.call(this), this.type = NP.Object.Type.SPHERE, this.position.x = void 0 !== a ? a : this.position.x, 
    this.position.y = void 0 !== b ? b : this.position.y, this.position.z = void 0 !== c ? c : this.position.z, 
    this.radius = void 0 !== d ? d : this.radius;
}, NP.Sphere.prototype = Object.create(NP.Object.prototype), NP.Sphere.prototype.constructor = NP.Sphere, 
NP.Pendulum = function(a, b) {
    NP.ObjectContainer.call(this), this.superObject = NP.Object.prototype, this.circle = void 0 !== a ? a : new NP.Circle(), 
    this.pivot = void 0 !== b ? b : new THREE.Vector3(), this.line = new NP.Line(this.circle.position, this.pivot), 
    this.position = this.circle.position, this.childs.push(this.line), this.childs.push(this.circle), 
    this.add({
        force: {
            tension: {
                pivot: this.pivot,
                object: this.circle
            }
        }
    }), this.set = function(a) {
        a = a || {};
    };
}, NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype), NP.Pendulum.prototype.constructor = NP.Pendulum, 
NP.Pendulum.prototype.update = function(a) {
    this.velocity.x += this.force.x * a, this.velocity.y += this.force.y * a, this.velocity.z += this.force.z * a;
    var b = this.velocity.clone().multiplyScalar(a);
    this.circle.position.add(b);
}, NP.Pendulum.prototype.add = function() {
    this.superObject.add.call(this, arguments[0]);
    var a, b = this.childs.length;
    for (a = 0; b > a; a++) this.childs[a].add.call(this.childs[a], arguments[0]);
}, NP.ColorSets = function() {
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
    d.lookAt(c.position);
    var g = new THREE.AxisHelper(100);
    c.add(g), this.camera = d, this.canvas = b.domElement, this.render = function() {
        var a, e;
        for (a = 0, e = f.length; e > a; a++) f[a].call(this);
        b.render(c, d);
    }, this.add = function(a) {
        var b, d = 16;
        switch (a.type) {
          case NP.Object.Type.LINE:
            b = new THREE.LineBasicMaterial({
                color: e.color1
            });
            var g = new THREE.Geometry();
            g.vertices.push(a.position), g.vertices.push(a.v2);
            var h = new THREE.Line(g, b);
            c.add(h), f.push(function() {
                g.verticesNeedUpdate = !0;
            });
            break;

          case NP.Object.Type.CIRCLE:
            g = new THREE.CircleGeometry(a.radius, d), b = new THREE.MeshBasicMaterial({
                color: e.color1
            });
            var i = new THREE.Mesh(g, b);
            i.position = a.position, c.add(i);
            break;

          case NP.Object.Type.SPHERE:
            g = new THREE.SphereGeometry(a.radius, d, d), b = new THREE.MeshBasicMaterial({
                color: e.color1,
                wireframe: !0
            });
            var j = new THREE.Mesh(g, b);
            j.position = a.position, c.add(j);
        }
    }, this.addContainer = function(a) {
        var b, c, d = a.childs;
        for (b = 0, c = d.length; c > b; b++) this.add(d[b]);
    };
}, NP.Renderer.prototype.constructor = NP.Renderer;
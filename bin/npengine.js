NP = {}, NP.DEBUG = !0, NextPhysics = function(a) {
    var b = new NP.Engine(), c = new NP.Renderer(a), d = .1;
    this.add = function(a) {
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
    };
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
}(), NP.Object.Type = {}, NP.Object.Type.CIRCLE = "circle", NP.ObjectContainer = function() {
    NP.Object.call(this);
}, NP.ObjectContainer.prototype = Object.create(NP.Object.prototype), NP.ObjectContainer.prototype.constructor = NP.ObjectContainer, 
NP.Point = function(a, b) {
    this.x = a || 0, this.y = b || 0, this.list = function() {
        return [ this.x, this.y ];
    };
}, NP.Point.prototype.constructor = NP.Point, NP.Circle = function(a, b, c) {
    NP.Object.call(this), this.type = NP.Object.Type.CIRCLE, this.x = void 0 !== a ? this.x : a, 
    this.y = void 0 !== b ? this.y : b, this.radius = void 0 !== c ? this.radius : c;
}, NP.Circle.prototype = Object.create(NP.Object.prototype), NP.Circle.prototype.constructor = NP.Circle, 
NP.Pendulum = function() {
    NP.ObjectContainer.call(this);
}, NP.Pendulum.prototype = Object.create(NP.ObjectContainer.prototype), NP.Pendulum.prototype.constructor = NP.Pendulum, 
NP.ColorSets = function() {
    var a = {
        background: "#FFFFFF",
        color1: "#DF4949",
        color2: "#E27A3F",
        color3: "#EFC94C",
        color4: "#45B29D",
        color5: "#334D5C"
    };
    return [ a ];
}(), NP.Renderer = function(a) {
    return new NP.Renderer3D(a);
}, NP.Renderer.prototype.constructor = NP.Renderer, NP.Renderer.prototype.render = function() {
    alert("error");
}, NP.Renderer.prototype.add = function() {
    alert("error");
}, NP.Renderer2D = function(a) {
    var b = new Two({
        width: a.offsetWidth,
        height: a.offsetHeight
    }).appendTo(a), c = NP.ColorSets[0];
    a.style.background = c.background, this.render = function() {
        b.update();
    }, this.add = function(a) {
        switch (a.type) {
          case NP.Object.Type.CIRCLE:
            var d = b.makeCircle(100, 100, 20);
            d.fill = c.color1, d.noStroke();
        }
    };
}, NP.Renderer2D.prototype = Object.create(NP.Renderer.prototype), NP.Renderer2D.prototype.constructor = NP.Renderer2D, 
NP.Renderer3D = function(a) {
    var b = new THREE.WebGLRenderer(), c = new THREE.Scene(), d = new THREE.PerspectiveCamera(45, a.offsetWidth / a.offsetHeight, 1, 100);
    b.setClearColor(new THREE.Color(15658734)), b.setSize(a.offsetWidth, a.offsetHeight), 
    a.appendChild(b.domElement), c.add(d);
    var e = new THREE.AxisHelper(100);
    c.add(e), this.render = function() {
        b.render(c, d);
    }, this.add = function(a) {
        switch (a.type) {
          case NP.Object.Type.CIRCLE:
            var b = new THREE.SphereGeometry(1, 15, 15), e = new THREE.MeshBasicMaterial({
                color: 7829503,
                wireframe: !0
            }), f = new THREE.Mesh(b, e);
            f.position.x = 0, f.position.y = 0, f.position.z = 0, c.add(f), d.position.x = 0, 
            d.position.y = 0, d.position.z = 10, d.lookAt(c.position);
        }
    };
}, NP.Renderer3D.prototype = Object.create(NP.Renderer.prototype), NP.Renderer3D.prototype.constructor = NP.Renderer3D;
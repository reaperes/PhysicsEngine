NPEngine = function(a) {
    if (!(a && a instanceof HTMLCanvasElement)) throw "HTMLCanvasElement parameter is empty or wrong.";
    {
        var b = new NPEngine.ObjectManager(), c = new NPEngine.RendererManager(a, b);
        new NPEngine.InteractionManager(a, b, c);
    }
    this.addObject = function(a) {
        b.addObject(a);
    };
    var d = function() {
        b.updateObjects(), c.render(), requestAnimationFrame(d, a);
    };
    requestAnimationFrame(d, a);
}, NPEngine.prototype.constructor = NPEngine, NPEngine.NPMath = function() {}, NPEngine.NPMath.prototype = {
    constructor: NPEngine.NPMath
}, NPEngine.InteractionManager = function(a, b, c) {
    var d = b.getObjects();
    a.addEventListener("mousedown", function(a) {
        e(a), console.log(a.canvasX + ", " + a.canvasY);
        for (var b = 0, c = d.length; c > b; b++) d[b].interactive && d[b].isObjectEvent(a) && d[b].onMouseDown(a);
    }, !1);
    var e = function(b) {
        var d = a.getBoundingClientRect();
        b.canvasX = (b.pageX - d.left) / c.scale - c.zeroPoint.x, b.canvasY = (b.pageY - d.top) / -c.scale - c.zeroPoint.y;
    };
}, NPEngine.ObjectManager = function() {
    var a = [];
    this.addObject = function(b) {
        a.push(b);
    }, this.getObjects = function() {
        return a;
    }, this.updateObjects = function() {
        for (var b = 0, c = a.length; c > b; b++) a[b].update();
    };
}, NPEngine.RendererManager = function(a, b) {
    this.canvas = a, this.npobjects = b.getObjects(), this.theme = new NPEngine.Theme(), 
    this.scale = 100, this.zeroPoint = new NPEngine.Point(0, 0);
    var c = new NPEngine.CanvasRenderer(this);
    this.render = function() {
        c.render();
    };
}, NPEngine.Theme = function() {
    this.bgColor = "rgb(250, 250, 250)", this.strokeStyle = "black";
}, NPEngine.NPObject = function() {
    this.interactive = !1, this.PENDULUM = 1;
}, NPEngine.NPObject.prototype = {
    constructor: NPEngine.NPObject,
    isObjectEvent: function() {
        throw new Error("Interactive npobject must override isObjectEvent method");
    },
    onMouseDown: function() {
        throw new Error("Interactive npobject must override onMouseDown method.");
    }
}, NPEngine.Circle = function(a, b, c) {
    this.x = a || 0, this.y = b || 0, this.radius = c || 0;
}, NPEngine.Line = function(a, b, c, d) {
    this.x1 = a || 0, this.y1 = b || 0, this.x2 = c || 0, this.y2 = d || 0, this.lineLength = Math.sqrt((c - a) * (c - a) - (d - b) * (d - b)), 
    this.lineWidth = 1;
}, NPEngine.Point = function(a, b) {
    this.x = a || 0, this.y = b || 0;
}, NPEngine.Point.prototype = {
    constructor: NPEngine.Point
}, NPEngine.Pendulum = function() {
    NPEngine.NPObject.call(this), this.type = NPEngine.NPObject.PENDULUM, this.interactive = !0;
    var a = new NPEngine.Point(), b = new NPEngine.Line(), c = new NPEngine.Circle();
    this.getPivot = function() {
        return a;
    }, this.setPivot = function(c) {
        c.x && (a.x = c.x || a.x, b.x1 = a.x), c.y && (a.y = c.y || a.y, b.y1 = a.y);
    }, this.getCircle = function() {
        return c;
    }, this.setCircle = function(a) {
        a.x && (c.x = a.x, b.x2 = a.x), a.y && (c.y = a.y, b.y2 = a.y), a.radius && (c.radius = a.radius);
    }, this.getLine = function() {
        return b;
    }, this.update = function() {}, this.isObjectEvent = function(a) {
        return a.pageX * a.pageX + a.pageY * a.pageY < c.radius * c.radius;
    }, this.onMouseDown = function() {
        console.log("onMouseDown");
    };
}, NPEngine.Pendulum.prototype = Object.create(NPEngine.NPObject.prototype), NPEngine.Pendulum.prototype.constructor = NPEngine.Pendulum, 
NPEngine.Grid = function() {}, NPEngine.CanvasGraphics = function() {
    this.renderGraphics = function(a, b) {
        var c = b.scale, d = b.theme, e = b.npobjects, f = b.zeroPoint;
        a.save(), a.strokeStyle = d.strokeStyle;
        for (var g = 0, h = e.length; h > g; g++) {
            var i = e[g];
            if (i.type != NPEngine.NPObject.PENDULUM) throw new Error("NPObject type does not match.");
            var j = i.getPivot(), k = i.getCircle();
            a.beginPath(), a.lineWidth = i.getLine().lineWidth, a.moveTo(f.x + j.x * c, f.y - j.y * c), 
            a.lineTo(f.x + k.x * c, f.y - k.y * c), a.stroke(), a.closePath(), a.beginPath(), 
            a.arc(f.x + k.x * c, f.y - k.y * c, k.radius * c, 0, 2 * Math.PI, !0), a.stroke(), 
            a.closePath();
        }
        a.restore();
    };
}, NPEngine.CanvasRenderer = function(a) {
    var b = a.canvas.getContext("2d"), c = new NPEngine.CanvasGraphics(a.theme, a.theme);
    this.render = function() {
        this.clear(), c.renderGraphics(b, a);
    }, this.clear = function() {
        b.save(), b.fillStyle = a.theme.bgColor, b.fillRect(0, 0, b.canvas.width, b.canvas.width), 
        b.restore();
    };
};
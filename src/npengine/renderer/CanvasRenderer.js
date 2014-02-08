NPEngine.CanvasRenderer = function(view) {
    this.DEBUG = true;

    this.children = [];

    this.view = view || document.createElement( "canvas" );
    if (view != 'undefined') {
        this.view.width = 800;
        this.view.height = 600;
    }
    this.context = this.view.getContext( "2d" );

    if (this.DEBUG) {
        this.fps = new NPEngine.FPSBoard();
    }
};

// constructor
NPEngine.CanvasRenderer.prototype.constructor = NPEngine.CanvasRenderer;



NPEngine.CanvasRenderer.prototype.render = function() {
    // clear
    this.context.clearRect(0, 0, this.view.width, this.view.height);


    // update
    var length = this.children.length;
    for (var i=0; i<length; i++) {
        this.children[i].update();
    }

    if (this.DEBUG) {
        this.fps.update();
    }


    // render
    for (var i=0; i<length; i++) {
        this.children[i].render(this.context);
    }

    if (this.DEBUG) {
        this.fps.render(this.context);
    }
};

NPEngine.CanvasRenderer.prototype.addChild = function(displayObject) {
    if (displayObject instanceof NPEngine.DisplayObject) {
        this.children.push(displayObject);
    }
};

NPEngine.CanvasRenderer.prototype.setFps = function(visible) {
    if (visible == true) {
        this.fps.visible = true;
    }
    else if (visible == false) {
        this.fps.visible = false;
    }
};
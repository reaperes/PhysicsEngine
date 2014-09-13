/**
 * @author namhoon <emerald105@hanmail.net>
 */

/**
 * @class NextPhysics
 * @param canvasContainer {HTMLElement}
 * @constructor
 */
NextPhysics = function (canvasContainer) {
  // prevent right mouse click
  document.oncontextmenu = document.body.oncontextmenu = function() {return false;};

  var defaults = {
  };

  var engine = new NP.Engine(this);
  var renderer = new NP.Renderer(canvasContainer);

  var deltaT = 0.01;
  this.gravity = new THREE.Vector3(0, 9.8, 0);

  this.add = function (npobject) {
    engine.add(npobject);
    renderer.add(npobject);
  };

  this.border = function (x1, y1, z1, x2, y2, z2) {

  };

  /****************************************************
   * Physics loop
   ****************************************************/

  this.update = function () {
    moveCamera();
    engine.update(deltaT);
  };

  this.render = function () {
    renderer.render();
  };

  this.start = function() {
    var loop = function() {
      this.update();
      this.render();
      requestAnimationFrame(loop, renderer.canvas);
    }.bind(this);

    var debugLoop = function() {
      stats.begin();
      this.update();
      this.render();
      stats.end();
      requestAnimationFrame(debugLoop, renderer.canvas);
    }.bind(this);

    if (NP.DEBUG) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
      requestAnimationFrame(debugLoop, renderer.canvas);
    }
    else {
      requestAnimationFrame(loop, renderer.canvas);
    }
  };

  /****************************************************
   * Control camera
   ****************************************************/
  var camera = renderer.camera;
  var radius = 30;
  var theta = 90;
  var phi = 90;
  camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  camera.position.y = radius * Math.sin( phi * Math.PI / 360 );
  camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var isMouseDown, onMouseDownTheta, onMouseDownPhi;
  var onMouseDownPosition = new THREE.Vector2();
  canvasContainer.addEventListener('mousedown', function (event) {
    event.preventDefault();
    isMouseDown = true;
    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
    onMouseDownPosition.x = event.pageX;
    onMouseDownPosition.y = event.pageY;
  }, false);

  canvasContainer.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (!isMouseDown) return;

    theta = -((event.pageX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
    phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;
    camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radius * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.updateProjectionMatrix();
    camera.lookAt( renderer.scene.position );
  }, false);

  canvasContainer.addEventListener('mouseup', function (event) {
    event.preventDefault();
    isMouseDown = false;
    onMouseDownPosition.x = event.pageX - onMouseDownPosition.x;
    onMouseDownPosition.y = event.pageY - onMouseDownPosition.y;
  }, false);

  canvasContainer.addEventListener('mouseover', function(e) {}.bind(this), false);
  canvasContainer.addEventListener('mousewheel', function(event) {
    event.preventDefault();

    var wheelDistance = camera.position.length() * 0.1;
    if (event.wheelDelta > 0) {
      camera.position.x -= wheelDistance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      camera.position.y -= wheelDistance * Math.sin(phi * Math.PI / 360);
      camera.position.z -= wheelDistance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      radius -= wheelDistance;
    }
    else {
      camera.position.x += wheelDistance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      camera.position.y += wheelDistance * Math.sin(phi * Math.PI / 360);
      camera.position.z += wheelDistance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
      radius += wheelDistance;
    }
  }, false);

//  /****************************************************
//   * Moving camera using keyboard
//   ****************************************************/
//  var cameraMaxVel = 0.5;
//  var cameraVertVel = 0;
//  var cameraHoriVel = 0;
//  function moveCamera() {
//    if (pressedKeys[KEY_UP] != pressedKeys[KEY_DOWN])
//      renderer.camera.position.y += pressedKeys[KEY_UP]
//        ? (cameraVertVel = cameraVertVel > cameraMaxVel ? cameraMaxVel : cameraVertVel + 0.01)
//        : (cameraVertVel = cameraVertVel < -cameraMaxVel ? -cameraMaxVel : cameraVertVel - 0.01);
//    if (pressedKeys[KEY_LEFT] != pressedKeys[KEY_RIGHT])
//      renderer.camera.position.x += pressedKeys[KEY_LEFT]
//        ? (cameraHoriVel = cameraHoriVel < -cameraMaxVel ? -cameraMaxVel : cameraHoriVel - 0.01)
//        : (cameraHoriVel = cameraHoriVel > cameraMaxVel ? cameraMaxVel : cameraHoriVel + 0.01);
//  }
//
//  /****************************************************
//   * Keyboard handling
//   ****************************************************/
//  var KEY_UP = 0;
//  var KEY_DOWN = 2;
//  var KEY_LEFT = 1;
//  var KEY_RIGHT = 5;
//  var pressedKeys = {
//    0: false,
//    2: false,
//    1: false,
//    5: false
//  };
//  //          w 87 119
//  // a 65 97  s 83 115  d 68 100
//  window.addEventListener('keydown', function (e) {
//    switch (e.keyCode) {
//      case 87: case 38: pressedKeys[KEY_UP]    = true; break;
//      case 83: case 40: pressedKeys[KEY_DOWN]  = true; break;
//      case 65: case 37: pressedKeys[KEY_LEFT]  = true; break;
//      case 68: case 39: pressedKeys[KEY_RIGHT] = true; break;
//    }
//  }, false);
//
//  window.addEventListener('keyup', function (e) {
//    switch (e.keyCode) {
//      case 87: case 38: pressedKeys[KEY_UP]    = false; cameraVertVel = 0; break;
//      case 83: case 40: pressedKeys[KEY_DOWN]  = false; cameraVertVel = 0; break;
//      case 65: case 37: pressedKeys[KEY_LEFT]  = false; cameraHoriVel = 0; break;
//      case 68: case 39: pressedKeys[KEY_RIGHT] = false; cameraHoriVel = 0; break;
//    }
//  }, false);
};

NextPhysics.prototype.constructor = NextPhysics;

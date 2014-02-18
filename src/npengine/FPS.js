NPEngine.FPS = function() {
  var startTime = Date.now(), prevTime = startTime;
  var ms = 0, msMin = Infinity, msMax = 0;
  var fps = 0, fpsMin = Infinity, fpsMax = 0;
  var frames = 0, mode = 0;

  var container = document.createElement('div');
  container.id='stats';
  container.style.cssText='width:80px;opacity:0.6;position:absolute;left:0px;top:0px';

  var fpsDiv = document.createElement('div');
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild(fpsDiv);

  var fpsText = document.createElement('div');
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild(fpsText);

  var fpsGraph = document.createElement('div');
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild(fpsGraph);

  while ( fpsGraph.children.length < 74 ) {
    var bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild(bar);
  }
  document.body.appendChild(container);


  var updateGraph = function ( dom, value ) {
    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';
  }

  return {
    begin: function () {
      startTime = Date.now();
    },

    end: function () {
      var time = Date.now();

      ms = time - startTime;
      msMin = Math.min( msMin, ms );
      msMax = Math.max( msMax, ms );

      frames ++;

      if ( time > prevTime + 1000 ) {
        fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
        fpsMin = Math.min( fpsMin, fps );
        fpsMax = Math.max( fpsMax, fps );

        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

        prevTime = time;
        frames = 0;
      }
      return time;
    },

    update: function () {
      startTime = this.end();
    }
  }
};

// constructor
NPEngine.FPS.prototype.constructor = NPEngine.FPS;




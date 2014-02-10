NPEngine.Convert = function() {};

NPEngine.Convert.prototype = Object.create(NPEngine.Convert.prototype);
NPEngine.Convert.prototype.constructor = NPEngine.Convert;



NPEngine.Convert.toDegrees = function(angle) {
  return angle * (180/Math.PI);
}

NPEngine.Convert.toRadians = function(angle) {
  return angle * (Math.PI/180);
}

NPEngine.Convert.toTimeFormat = function(milliseconds) {
  milliseconds = parseInt(milliseconds/10);

  var ms = milliseconds % 100;
  milliseconds = (milliseconds - ms) / 100;
  var secs = milliseconds % 60;
  milliseconds = (milliseconds - secs) / 60;


  var mins = milliseconds % 60;
  if (mins < 10) {
    mins = '0' + mins;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }
  if (ms < 10) {
    ms = '0' + ms;
  }
//  var hrs = (milliseconds - mins) / 60;

//  return hrs + ':' + mins + ':' + secs + '.' + ms;
  return mins + ':' + secs + ':' + ms;
}
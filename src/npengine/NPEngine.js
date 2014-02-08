NPEngine = function(displayObject, callback) {
  if (displayObject == null || (displayObject instanceof NPEngine.DisplayObject) == false) {
    throw new Error('parameter is not DisplayObject');
  }
  // init database
  var dbHelper = new NPEngine.DBHelper;

  dbHelper.promiseOpen(displayObject).then(function(db) {
    alert('compute');
    displayObject.compute(db);
  }, function(error) {
    alert('error');
    console.log(error);
  }).then(function() {
    callback();
  });

  return {
    dbHelper : dbHelper
  };

//  var promise = new Promise(function(resolve, reject) {
//    resolve(1);
//  });
//
//  promise.then(function(val) {
//    console.log(val);
//    return val+2;
//  }).then(function(val) {
//      console.log(val);
//  });
};

NPEngine.prototype.constructor = NPEngine.Pendulum;

NPEngine = function() {
  // init database
  var dbHelper = new NPEngine.DBHelper;

  var promise = new Promise(function(resolve, reject) {
    dbHelper.promiseOpen().then(function() {
      alert('success');
    }, function(error) {
      alert('error');
      console.log(error);
    });
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



NPEngine.prototype.initDB = function() {

};

//MyClass = function( a, b ) {
//  this.sum = function() {
//    return internalCalcSum();
//  };
//  var internalCalcSum = function() {
//    return a + b;
//  };
//};







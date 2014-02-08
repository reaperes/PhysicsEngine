NPEngine.DBHelper = function () {
};

NPEngine.DBHelper.prototype.constructor = NPEngine.DBHelper;



NPEngine.DBHelper.prototype.createDB = function (callback) {
  var that = this;
  var request = window.indexedDB.deleteDatabase('NPEngine');
  request.onsuccess = function() {
    that.open();
  };
  request.onerror = function() {
    alert('create db error');
  };
};

NPEngine.DBHelper.prototype.promiseOpen = function (displayObject) {
  var version = 1;
  var promise = new Promise(function(resolve, reject) {
    var request = window.indexedDB.open('NPEngine', version);
    request.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(displayObject.toString())) {
        var objectStore = db.createObjectStore(displayObject.toString(), {keyPath: 'time'});
      }
    };
    request.onsuccess = function(e) {
      this.db = e.target.result;
      resolve(this.db);
    };
    request.onerror = function(e) {
      reject(e);
    }
  });
  return promise;
};


















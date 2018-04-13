musicien.factory('oneSignal', function($http, $q, configuracionGlobal, $q) {

  var signal = {
    CheckRegistered: function() {
      var deferred = $q.defer();
      OneSignal.push(function() {
      /* These examples are all valid */
      OneSignal.isPushNotificationsEnabled(function(isEnabled) {
        if (isEnabled)
          deferred.resolve(true);
        else
          deferred.resolve(false);
        });
      });
      return deferred.promise;
    },
    Register: function() {
      console.log("Registarndo")
      OneSignal.push(function() {
        OneSignal.registerForPushNotifications();
      });
    },
    SendTag: function(IDUsuario) {
      OneSignal.push(["sendTag", "IDUsuario", IDUsuario])
    }
  }
  return {
    signal
  }
});

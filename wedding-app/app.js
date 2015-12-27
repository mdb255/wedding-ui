(function() {
  'use strict';

  angular.module('weddingApp', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'appConfig',
    'LocalStorageModule'
  ]).
    run(['$rootScope', '$location', '$log', function($rootScope, $location, $log) {
      // Watch the URL location to update the active tab on the navbar
      var path = function() { return $location.path(); };
      $rootScope.$watch(path, function(newVal, oldVal) {
        $rootScope.activeTab = newVal;
        $log.debug("ActiveTab: " + $rootScope.activeTab);
      });
    }]);

})();

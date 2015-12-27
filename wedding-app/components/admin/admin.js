/**
 * Created by Mike on 5/25/2015.
 */

(function() {
  'use strict';

  angular.module('adminApp', ['appConfig']);

  angular
    .module('adminApp')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['$scope', '$log', '$http', 'appConfig'];

  function AdminCtrl($scope, $log, $http, appConfig) {
    $http.get(appConfig.apiUrl + '/rsvps').success(function(data) {
      $log.debug("data: " + JSON.stringify(data));

      $scope.rsvps = data;
    });
  }
})();

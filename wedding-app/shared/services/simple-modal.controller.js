/**
 * Created by Mike on 11/8/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('SimpleModalCtrl', SimpleModalCtrl);

  SimpleModalCtrl.$inject = ['$scope', '$modalInstance', 'title', 'message'];

  function SimpleModalCtrl($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.ok = function () {
      $modalInstance.close('ok');
    };
  }
})();

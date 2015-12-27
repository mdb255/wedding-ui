/**
 * Created by Mike on 4/26/2015.
 */

(function() {
  'use strict';

  var gift = angular.module('giftApp', []);

  gift.config(function($locationProvider) {
    //$locationProvider.html5Mode(true);
  });

  gift.controller('GiftCtrl', function ($scope, $location, $log) {
    $scope.from = $location.search().from;
    $scope.items = JSON.parse($location.search().items);
    $log.debug("from=" + $scope.from + ", items=" + $scope.items);
  });
})();

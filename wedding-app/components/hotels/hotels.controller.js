(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('HotelsCtrl', HotelsCtrl);

  HotelsCtrl.$inject = ['$window'];

  function HotelsCtrl($window) {
    $window.scrollTo(0, 0);
  }
})();

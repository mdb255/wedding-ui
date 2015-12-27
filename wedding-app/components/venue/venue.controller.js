(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('VenueCtrl', VenueCtrl);

  VenueCtrl.$inject = ['$window'];

  function VenueCtrl($window) {
    $window.scrollTo(0, 0);
  }
})();
